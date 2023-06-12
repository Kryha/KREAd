/// <reference types="ses"/>
import React, { createContext, useReducer, useContext, useEffect, useRef } from "react";
import { Far } from "@endo/marshal";
import { makeCapTP, E } from "@endo/captp";
import { observeIteration } from "@agoric/notifier";

import dappConstants from "../service/conf/defaults";
import { activateWebSocket, getActiveSocket } from "../service/utils/fetch-websocket";
import { AgoricDispatch, AgoricState, AgoricStateActions } from "../interfaces/agoric.interfaces";
import { getTokenInfo } from "../service/util";

const {
  INSTANCE_NFT_MAKER_BOARD_ID,
  // INSTALLATION_BOARD_ID,
  issuerBoardIds: {
    Character: CHARACTER_ISSUER_BOARD_ID,
    Item: ITEM_ISSUER_BOARD_ID,
    Token: TOKEN_ISSUER_BOARD_ID
  },
} = dappConstants;

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
  agoric: {
    zoe: undefined,
    board: undefined,
    zoeInvitationDepositFacetId: undefined,
    invitationIssuer: undefined,
    walletP: undefined,
    apiSend: undefined,
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
    }
  },
  isLoading: true,
};

export type ServiceDispatch = React.Dispatch<AgoricStateActions>;
type ProviderProps = Omit<React.ProviderProps<AgoricState>, "value">;

const Context = createContext<AgoricState | undefined>(undefined);
const DispatchContext = createContext<ServiceDispatch | undefined>(undefined);

const Reducer = (state: AgoricState, action: AgoricStateActions): AgoricState => {
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

    case "RESET":
      return initialState;

    default:
      throw new Error("Only defined action types can be handled;");
  }
};

export const AgoricStateProvider = (props: ProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const walletPRef = useRef(undefined);

  const processOffers = async (offers: any[], agoricDispatch: AgoricDispatch) => {
    if (!offers.length) return;
    agoricDispatch({ type: "SET_OFFERS", payload: offers });
  };

  useEffect(() => {
    // Receive callbacks from the wallet connection.
    const otherSide = Far("otherSide", {
      needDappApproval(_dappOrigin: any, _suggestedDappPetname: any) {
        dispatch({ type: "SET_DAPP_APPROVED", payload: false });
        dispatch({ type: "SET_SHOW_APPROVE_DAPP_MODAL", payload: true });
      },
      dappApproved(_dappOrigin: any) {
        dispatch({ type: "SET_DAPP_APPROVED", payload: true });
        dispatch({ type: "SET_SHOW_APPROVE_DAPP_MODAL", payload: false });
      },
    });

    // TODO: Implement
    let walletAbort: () => any;
    let walletDispatch: (arg0: any) => any;

    const onConnect = async () => {
      // Set up wallet through socket
      console.info("Connecting to wallet...");

      const socket = getActiveSocket();

      const {
        abort: ctpAbort,
        dispatch: ctpDispatch,
        getBootstrap,
      } = makeCapTP("CB", (obj: any) => socket.send(JSON.stringify(obj)), otherSide);

      walletAbort = ctpAbort;
      walletDispatch = ctpDispatch;
      const walletP = getBootstrap();
      walletPRef.current = walletP;
      dispatch({ type: "SET_WALLET_CONNECTED", payload: true });

      // Initialize agoric service based on constants
      const zoe = await E(walletP).getZoe();
      const board = await E(walletP).getBoard();
      const instanceNft = await E(board).getValue(INSTANCE_NFT_MAKER_BOARD_ID);
      const kreadFacet = await E(zoe).getPublicFacet(instanceNft);
      const invitationIssuer = await E(zoe).getInvitationIssuer(kreadFacet);
      
      const tokenInfo = await getTokenInfo(kreadFacet, board);

      
      dispatch({ type: "SET_TOKEN_INFO", payload: tokenInfo });
      dispatch({ type: "SET_AGORIC", payload: { zoe, board, invitationIssuer, walletP } });
      dispatch({ type: "SET_CHARACTER_CONTRACT", payload: { instance: instanceNft, publicFacet: kreadFacet } });
      
      const observer = harden({
        updateState: async (offers: any) => {
          console.count("📡 CHECKING OFFERS");
          processOffers(offers, dispatch);
        },
        finish: (completion: unknown) => console.info("INVENTORY NOTIFIER FINISHED", completion),
        fail: (reason: unknown) => console.info("INVENTORY NOTIFIER ERROR", reason),
      });
      
      async function watchOffers() {
        const offerNotifier = E(walletP).getOffersNotifier();
        observeIteration(offerNotifier, observer);
      }
      
      watchOffers().catch((err) => {
        console.error("got watchOffers err", err);
      });
      
      await Promise.all([
        E(walletP).suggestInstallation("Installation NFT", INSTANCE_NFT_MAKER_BOARD_ID),
        // E(walletP).suggestInstallation("Installation", INSTALLATION_BOARD_ID),
        E(walletP).suggestIssuer("CHARACTER", CHARACTER_ISSUER_BOARD_ID/*, tokenInfo.boardIds.character.issuer*/),
        E(walletP).suggestIssuer("ITEM", ITEM_ISSUER_BOARD_ID/*, tokenInfo.boardIds.item.issuer*/),
        E(walletP).suggestIssuer("TOKEN", TOKEN_ISSUER_BOARD_ID/*, tokenInfo.boardIds.paymentFT.issuer*/),
      ]);

      console.count("🔧 LOADING AGORIC SERVICE 🔧");

      dispatch({ type: "SET_LOADING", payload: false });
    };

    const onDisconnect = () => {
      dispatch({ type: "SET_WALLET_CONNECTED", payload: true });
      walletAbort && walletAbort();
    };

    const onMessage = (data: string) => {
      const obj = JSON.parse(data);
      walletDispatch && walletDispatch(obj);
    };

    activateWebSocket({
      onConnect,
      onDisconnect,
      onMessage,
    });
    // return deactivateWebSocket;
  }, []);

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
