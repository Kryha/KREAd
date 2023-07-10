/// <reference types="ses"/>
import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import { AgoricDispatch, AgoricState, AgoricStateActions } from "../interfaces/agoric.interfaces";
import { makeAgoricKeplrConnection, AgoricKeplrConnectionErrors as Errors } from "@agoric/web-components";
import { isDevelopmentMode, networkConfigs } from "../constants";
import WalletBridge from "./wallet-bridge";
import { useDataMode } from "../hooks";
import {
  ImportContext,
  makeImportContext,
} from '@agoric/smart-wallet/src/marshal-contexts';
import { makeAgoricChainStorageWatcher } from "../service/storage-node/chain-storage-watcher";
import { fetchChainInfo } from "./util";
import { watchCharacter } from "../service/storage-node/watch-character";
import { AgoricChainStoragePathKind as Kind } from '@agoric/rpc';

const initialState: AgoricState = {
  status: {
    walletConnected: false,
    dappApproved: false,
    showApproveDappModal: false,
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
    addOffer: undefined,
    publicSubscribersNotifier: undefined,
    leader: undefined,
    address: undefined,
    chainId: "",
    unserializer: undefined,
    importContext: undefined
  },
  contracts: {
    // FIXME: rename to kread
    characterBuilder: {
      instance: undefined,
      publicFacet: undefined,
    },
  },
  tokenInfo: {
    character: { issuer: undefined, brand: undefined },
    item: { issuer: undefined, brand: undefined },
    paymentFT: { issuer: undefined, brand: undefined },
    boardIds: {
      character: { issuer: undefined, brand: undefined },
      item: { issuer: undefined, brand: undefined },
      paymentFT: { issuer: undefined, brand: undefined },
    },
  },
  isLoading: false,
  isReady: false,
  chainStorageWatcher: undefined
};

type Status = 'initialState' | 'keplrReady' | 'storageWatcherReady' | 'ready'

const status = {
  initialState: 'initialState',
  keplrReady: 'keplrReady',
  storageWatcherReady: 'storageWatcherReady',
  ready: 'ready'
} as const;

export type ServiceDispatch = React.Dispatch<AgoricStateActions>;
type ProviderProps = Omit<React.ProviderProps<AgoricState>, "value">;

const Context = createContext<AgoricState | undefined>(undefined);
const DispatchContext = createContext<ServiceDispatch | undefined>(undefined);

const Reducer = (state: AgoricState, action: AgoricStateActions): AgoricState => {
  console.log(action.type)
  switch (action.type) {
    case "SET_DAPP_APPROVED":
      return { ...state, status: { ...state.status, dappApproved: action.payload } };

    case "SET_SHOW_APPROVE_DAPP_MODAL":
      return { ...state, status: { ...state.status, showApproveDappModal: action.payload } };

    case "SET_WALLET_CONNECTED":
      return { ...state, status: { ...state.status, walletConnected: action.payload } };

    case "SET_OFFERS":
      return { ...state, offers: action.payload };

    case "SET_AGORIC":
      return { ...state, agoric: { ...state.agoric, ...action.payload } };

    case "SET_APISEND":
      return { ...state, agoric: { ...state.agoric, apiSend: action.payload } };

    case "SET_CHARACTER_CONTRACT":
      return { ...state, contracts: { ...state.contracts, characterBuilder: action.payload } };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_TOKEN_INFO":
      return { ...state, tokenInfo: action.payload };

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
  };
};

export const AgoricStateProvider = (props: ProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [currentStatus, setCurrentStatus] = useState<Status>(status.initialState);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const processOffers = async (offers: any[], agoricDispatch: AgoricDispatch) => {
    if (!offers.length) return;
    agoricDispatch({ type: "SET_OFFERS", payload: offers });
  };
  

  useEffect(() => {
    if (isCancelled) return;
    // TODO: consider implementing terms agreement
    // if (checkTerms && !areLatestTermsAgreed) {
    //   setIsTermsDialogOpen(true);
    //   return;
    // }

    let connection;
    // dispatch({ type: "SET_LOADING", payload: true });

    const connectKeplr = async () => {
      try {
        connection = await makeAgoricKeplrConnection(networkConfigs.localDevnet.url)
        connection = { ...connection, importContext: makeImportContext() }
        // FIXME: remove log
        console.log("KEPLER CONNECTION: ", connection);
        dispatch({ type: "SET_WALLET_CONNECTION", payload: connection })
        setCurrentStatus(status.keplrReady);
      } catch (e: any) {
        switch (e.message) {
          case Errors.enableKeplr:
            console.error("Enable the connection in Keplr to continue.");
            break;
          case Errors.networkConfig:
            console.error("Network not found.");
            break;
          case Errors.noSmartWallet:
            console.error("NO SMART WALLET");
            break;
        }
      };
    }
  
    const startWatching = async () => {
      if (state.chainStorageWatcher) return;
      try {
        const { rpc, chainName } = await fetchChainInfo(networkConfigs.localDevnet.url);
        const chainStorageWatcher = makeAgoricChainStorageWatcher(
          rpc,
          chainName,
          state.walletConnection.importContext.fromBoard.unserialize,
          e => {
            console.error(e);
            throw e;
          },
        )
        
        dispatch({ type: "SET_CHAIN_STORAGE_WATCHER", payload: chainStorageWatcher });
        setCurrentStatus(status.storageWatcherReady);
      } catch (e) {
        if (isCancelled) return;
        console.error(e);
      }
    };

    // FIXME: remove log
    console.count("CONNECTING");
    if (currentStatus === status.initialState) {
      connectKeplr();
    } else if (currentStatus === status.keplrReady) {
      startWatching();
    } else if (currentStatus === status.storageWatcherReady) {
      setCurrentStatus(status.ready)
      return () => {
        setIsCancelled(true);
      };
    }
  }, [currentStatus, isCancelled]);

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <WalletBridge />
        {props.children}
      </DispatchContext.Provider>
    </Context.Provider>
  );
};

export const useAgoricState = (): AgoricState => {
  const state = useContext(Context);
  const { mockData } = useDataMode();

  if (state === undefined) {
    throw new Error("useAgoricState can only be called inside a ServiceProvider.");
  }

  if (isDevelopmentMode) {
    if (mockData) {
      state.isLoading = false;
    }
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
