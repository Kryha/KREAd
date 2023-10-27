/// <reference types="ses"/>
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { AgoricDispatch, AgoricState, AgoricStateActions, TokenInfo } from "../interfaces";
import { AgoricKeplrConnectionErrors as Errors, makeAgoricWalletConnection } from "@agoric/web-components";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { CHARACTER_IDENTIFIER, IST_IDENTIFIER, ITEM_IDENTIFIER, KREAD_IDENTIFIER, NETWORK_CONFIG, NO_SMART_WALLET_ERROR } from "../constants";
import { fetchChainInfo } from "./util";
import { AgoricChainStoragePathKind as Kind, ChainStorageWatcher, makeAgoricChainStorageWatcher } from "@agoric/rpc";

const initialState: AgoricState = {
  status: {
    walletProvisioned: false,
  },
  offers: [],
  notifiers: {
    shop: {
      items: undefined,
      characters: undefined,
    },
  },
  addOffer: undefined,
  agoric: {
    zoe: undefined,
    board: undefined,
    zoeInvitationDepositFacetId: undefined,
    invitationIssuer: undefined,
    walletP: undefined,
    apiSend: undefined,
  },
  walletConnection: {
    pursesNotifier: undefined,
    makeOffer: undefined,
    publicSubscribersNotifier: undefined,
    leader: undefined,
    chainId: "",
    unserializer: undefined,
    importContext: undefined,
    provisionSmartWallet: undefined,
    smartWalletStatusNotifierKit: undefined,
    smartWalletProvisioned: false,
    address: "",
  },
  contracts: {
    kread: {
      instance: undefined,
    },
  },
  tokenInfo: {
    character: { issuer: undefined, brand: undefined },
    item: { issuer: undefined, brand: undefined },
    ist: { issuer: undefined, brand: undefined },
  },
  isLoading: false,
  isReady: false,
  chainStorageWatcher: undefined,
};

export type ServiceDispatch = React.Dispatch<AgoricStateActions>;
type ProviderProps = Omit<React.ProviderProps<AgoricState>, "value">;

const Context = createContext<AgoricState | undefined>(undefined);
const DispatchContext = createContext<ServiceDispatch | undefined>(undefined);

const Reducer = (state: AgoricState, action: AgoricStateActions): AgoricState => {
  switch (action.type) {
    case "UPDATE_STATUS":
      return { ...state, status: { ...state.status, ...action.payload } };

    case "SET_OFFERS":
      return { ...state, offers: action.payload };

    case "SET_AGORIC":
      return { ...state, agoric: { ...state.agoric, ...action.payload } };

    case "SET_APISEND":
      return { ...state, agoric: { ...state.agoric, apiSend: action.payload } };

    case "SET_KREAD_CONTRACT":
      return { ...state, contracts: { ...state.contracts, kread: action.payload } };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_TOKEN_INFO":
      return { ...state, tokenInfo: { ...action.payload } };

    case "SET_ADD_OFFER":
      return { ...state, addOffer: action.payload };

    case "SET_WALLET_CONNECTION":
      return { ...state, walletConnection: action.payload };

    case "SET_CHAIN_STORAGE_WATCHER":
      return { ...state, chainStorageWatcher: action.payload };

    case "RESET":
      return initialState;

    default:
      throw new Error("Only defined action types can be handled;");
  }
};

export const AgoricStateProvider = (props: ProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  useEffect(() => {
    if (isCancelled) return;
    // TODO: consider implementing terms agreement
    // if (checkTerms && !areLatestTermsAgreed) {
    //   setIsTermsDialogOpen(true);
    //   return;
    // }

    let chainStorageWatcher: ChainStorageWatcher;
    let connection: any;

    const connectAgoric = async () => {
      try {
        connection = await makeAgoricWalletConnection(chainStorageWatcher);
        connection = { ...connection };
        dispatch({ type: "SET_WALLET_CONNECTION", payload: connection });
        await updateSmartWalletStatus();
      } catch (e: any) {
        console.error(e);
        switch (e.message) {
          case Errors.enableKeplr:
            console.error("Enable the connection in Keplr to continue.");
            break;
          case Errors.networkConfig:
            console.error("Network not found.");
            break;
        }
      }
    };

    const updateSmartWalletStatus = async () => {
      const smartWalletStatusNotifierKit = connection.smartWalletStatusNotifier;
      console.info("✅ LISTENING FOR SMART-WALLET CHANGES", smartWalletStatusNotifierKit);
      const watch = async () => {
        for await (const status of iterateNotifier(smartWalletStatusNotifierKit)) {
          if (state.status.walletProvisioned) return;
          if (status && status.provisioned) {
            dispatch({ type: "UPDATE_STATUS", payload: { walletProvisioned: true }});
          } else {
            dispatch({ type: "UPDATE_STATUS", payload: { walletProvisioned: false }});
          }
        }
      };
      watch().catch((err: Error) => {
        console.error("got status watch err", err);
      });
    };

    const fetchInstance = async () => {
      // TODO: consider typing the result
      const instances: any[] = await chainStorageWatcher.queryOnce([Kind.Data, "published.agoricNames.instance"]);
      const instance = instances.filter((instance: string[]) => instance[0] === KREAD_IDENTIFIER);

      dispatch({ type: "SET_KREAD_CONTRACT", payload: { instance: instance[0][1] } });
    };

    const fetchTokenInfo = async () => {
      // TODO: consider typing the result
      const agoricNameBrands: any[] = await chainStorageWatcher.queryOnce([Kind.Data, "published.agoricNames.brand"]);
      const payload: TokenInfo = {
        character: {
          issuer: undefined,
          brand: undefined,
          petName: CHARACTER_IDENTIFIER,
        },
        item: {
          issuer: undefined,
          brand: undefined,
          petName: ITEM_IDENTIFIER,
        },
        ist: {
          issuer: undefined,
          brand: undefined,
          petName: IST_IDENTIFIER,
        },
      };
      for (const i of agoricNameBrands) {
        switch (i[0]) {
          case ITEM_IDENTIFIER:
            payload.item.brand = i[1];
            break;
          case IST_IDENTIFIER:
            payload.ist.brand = i[1];
            break;
          case CHARACTER_IDENTIFIER:
            payload.character.brand = i[1];
            break;
          default:
            break;
        }
      }
      dispatch({ type: "SET_TOKEN_INFO", payload });
    };

    const startWatching = async () => {
      if (isCancelled) return;
      if (state.chainStorageWatcher && state.status.walletProvisioned) {
        console.info("Storagewatcher found, skipping startWatching");
        return;
      }
      const backendError = (e: any) => {
        if (e.message === NO_SMART_WALLET_ERROR) {
          dispatch({ type: "UPDATE_STATUS", payload: { walletProvisioned: false }});
        } else {
          console.error('Error in wallet backend', e);
        }
        return;
      };

      try {

        const { rpc, chainName } = await fetchChainInfo(NETWORK_CONFIG);
        chainStorageWatcher = makeAgoricChainStorageWatcher(rpc, chainName, backendError);
        dispatch({ type: "SET_CHAIN_STORAGE_WATCHER", payload: chainStorageWatcher });
        dispatch({ type: "UPDATE_STATUS", payload: { walletProvisioned: true }});
        connectAgoric();
        fetchInstance();
        fetchTokenInfo();
      } catch (e) {
        console.error(e);
      }
    };

    const runEffects = async () => {
      await startWatching();
    };

    runEffects();

    return () => {
      setIsCancelled(true);
    };
  }, [isCancelled, state.status.walletProvisioned, state.chainStorageWatcher]);

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{props.children}</DispatchContext.Provider>
    </Context.Provider>
  );
};

export const useAgoricState = (): AgoricState => {
  const state = useContext(Context);

  if (state === undefined) {
    throw new Error("useAgoricState can only be called inside a ServiceProvider.");
  }

  return state;
};

export const useAgoricStateDispatch = (): React.Dispatch<AgoricStateActions> => {
  const dispatch = useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error("useAgoricDispatch can only be called inside a ServiceProvider.");
  }
  return dispatch;
};

export const useAgoricContext = (): [AgoricState, AgoricDispatch] => [useAgoricState(), useAgoricStateDispatch()];
