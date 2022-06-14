/// <reference types="ses"/>
// import { assert } from '@agoric/assert';
// import '@endo/init';
import React, { createContext, useReducer, useContext, useEffect, useRef } from "react";
import { Far } from "@endo/marshal";
import { makeCapTP, E } from "@endo/captp";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import dappConstants from "../service/conf/defaults";

import {
  activateWebSocket,
  deactivateWebSocket,
  getActiveSocket,
} from "../service/utils/fetch-websocket";
import { connect } from "../service/lib/connect";

const {
  INSTANCE_BOARD_ID,
  INVITE_BRAND_BOARD_ID,
  INSTALLATION_BOARD_ID,
  issuerBoardIds: { Character: CHARACTER_ISSUER_BOARD_ID },
  brandBoardIds: { Money: MONEY_BRAND_BOARD_ID, Character: CHARACTER_BRAND_BOARD_ID },
} = dappConstants;

console.log(dappConstants);

export type AgoricService = {
  zoe: any;
  board: any;
  instance: any;
  publicFacet: any;
  zoeInvitationDepositFacetId: any;
  invitationIssuer: any;
  walletP: any;
};

export type ServiceState = {
  walletConnected: boolean;
  dappApproved: boolean;
  showApproveDappModal: boolean;
  tokenPurses: any[];
  characterPurse: {
    [key: string]: any,
  };
  agoric: AgoricService;
  apiSend: any;
  isLoading: boolean;
};

export type PursePetname = [string, string];

const initialState: ServiceState = {
  walletConnected: false,
  dappApproved: false,
  showApproveDappModal: false,
  tokenPurses: [],
  characterPurse: [],
  agoric: {
    zoe: undefined,
    board: undefined,
    instance: undefined,
    publicFacet: undefined,
    zoeInvitationDepositFacetId: undefined,
    invitationIssuer: undefined,
    walletP: undefined,
  },
  apiSend: undefined,
  isLoading: false,
};

export interface SetDappApproved {
  type: "SET_DAPP_APPROVED";
  payload: boolean;
}

export interface SetWalletConnected {
  type: "SET_WALLET_CONNECTED";
  payload: boolean;
}

export interface SetShowApproveDappModal {
  type: "SET_SHOW_APPROVE_DAPP_MODAL";
  payload: boolean;
}

export interface SetTokenPurses {
  type: "SET_TOKEN_PURSES";
  payload: any[];
}

export interface SetCharacterPurses {
  type: "SET_CHARACTER_PURSES";
  payload: any[];
}

export interface SetAgoric {
  type: "SET_AGORIC";
  payload: AgoricService;
}
export interface SetApiSend {
  type: "SET_APISEND";
  payload: any;
}
export interface SetLoading {
  type: "SET_LOADING";
  payload: boolean;
}

export interface Reset {
  type: "RESET";
}

export type ServiceStateActions =
  | Reset
  | SetDappApproved
  | SetWalletConnected
  | SetShowApproveDappModal
  | SetTokenPurses
  | SetCharacterPurses
  | SetAgoric
  | SetApiSend
  | SetLoading;

type Dispatch = React.Dispatch<ServiceStateActions>;
type ProviderProps = Omit<React.ProviderProps<ServiceState>, "value">;

const Context = createContext<ServiceState | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const Reducer = (state: ServiceState, action: ServiceStateActions): ServiceState => {
  switch (action.type) {
  case "SET_DAPP_APPROVED":
    return { ...state, dappApproved: action.payload };

  case "SET_SHOW_APPROVE_DAPP_MODAL":
    return { ...state, showApproveDappModal: action.payload };

  case "SET_WALLET_CONNECTED":
    return { ...state, walletConnected: action.payload };

  case "SET_TOKEN_PURSES":
    return { ...state, tokenPurses: action.payload };
    
  case "SET_CHARACTER_PURSES":
    return { ...state, characterPurse: action.payload };
    
  case "SET_AGORIC":
    return { ...state, agoric: { ...state.agoric, ...action.payload }};
      
  case "SET_APISEND":
    return { ...state, apiSend: action.payload };

  case "SET_LOADING":
    return { ...state, isLoading: action.payload };
    
  case "RESET":
    return initialState;

  default:
    throw new Error("Only defined action types can be handled;");
  }
};

export const ServiceStateProvider = (props: ProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const walletPRef = useRef(undefined);
  const publicFacetRef = useRef(undefined);
  
  useEffect(() => {
    // Receive callbacks from the wallet connection.
    const otherSide = Far("otherSide", {
      needDappApproval(_dappOrigin: any, _suggestedDappPetname: any) {
        dispatch({ type: "SET_DAPP_APPROVED", payload: false });
        dispatch({ type: "SET_SHOW_APPROVE_DAPP_MODAL", payload: true });
      },
      dappApproved(_dappOrigin: any) {
        dispatch({ type: "SET_DAPP_APPROVED", payload: true });
      },
    });

    let walletAbort: () => any;
    let walletDispatch: (arg0: any) => any;

    const onConnect = async () => {
      console.info("Connecting to wallet...");

      const apiRecv = (obj: any) => {
        switch (obj.type) {
        case "nft-maker/nftTestResponse": {
          console.log("GOT CHARACTERS:");
          console.log(obj.data);
          return obj.data;
        }
        case "nftFaucet/sendInvitationResponse": {
          // Once the invitation has been sent to the user, we update the
          // offer to include the invitationBoardId. Then we make a
          // request to the user's wallet to send the proposed offer for
          // acceptance/rejection.
          const { offer } = obj.data;
          console.log("OFFER INCOMING: ", offer);
          // eslint-disable-next-line no-use-before-define
          // addOffer(offer);
          break;
        }
        case "CTP_DISCONNECT": {
          // TODO: handle this appropriately
          break;
        }
        default: {
          throw Error(`unexpected apiRecv obj.type ${obj.type}`);
        }
        }
      };

      await connect("/api/nft-maker", apiRecv).then((rawApiSend) => {
        dispatch({ type: "SET_APISEND", payload: rawApiSend });  
      });
      dispatch({ type: "SET_WALLET_CONNECTED", payload: true });
      const socket = getActiveSocket();
      const {
        abort: ctpAbort,
        dispatch: ctpDispatch,
        getBootstrap,
      } = makeCapTP(
        "CB",
        (obj: any) => socket.send(JSON.stringify(obj)),
        otherSide,
      );
      walletAbort = ctpAbort;
      walletDispatch = ctpDispatch;
      const walletP = getBootstrap();
      walletPRef.current = walletP;

      const processPurses = (purses: any[]) => {
        const newTokenPurses = purses.filter(
          ({ brandBoardId }) => brandBoardId === MONEY_BRAND_BOARD_ID,
        );
        const newCharacterPurses = purses.find(
          ({ brandBoardId }) => brandBoardId === CHARACTER_BRAND_BOARD_ID,
        );

        dispatch({ type: "SET_TOKEN_PURSES", payload: newTokenPurses });
        dispatch({ type: "SET_CHARACTER_PURSES", payload: newCharacterPurses });

        console.log("Token Purse Info: ", newTokenPurses[0].displayInfo);
        console.log("Token Purse Petname: ", newTokenPurses[0].brandPetname);
        console.log("Character Purse Info: ", newCharacterPurses[0].displayInfo);
        console.log("Character Purse Petname: ", newCharacterPurses[0].brandPetname);
      };

      async function watchPurses() {
        const pn = E(walletP).getPursesNotifier();
        for await (const purses of iterateNotifier(pn)) {
          // dispatch(setPurses(purses));
          console.log("CHECKING PURSE: ", purses);
          processPurses(purses);
        }
      }
      watchPurses().catch((err) => {
        console.error("got watchPurses err", err);
        console.log(err);
      });

      await Promise.all([
        E(walletP).suggestInstallation("Installation", INSTALLATION_BOARD_ID),
        E(walletP).suggestInstance("Instance", INSTANCE_BOARD_ID),
        E(walletP).suggestIssuer("CB", CHARACTER_ISSUER_BOARD_ID),
        // E(walletP).suggestIssuer("CBI", ITEM_ISSUER_BOARD_ID),
      ]);

      const zoeInvitationDepositFacetId = await E(walletP).getDepositFacetId(INVITE_BRAND_BOARD_ID);
      const zoe = E(walletP).getZoe();
      const board = E(walletP).getBoard();
      const instance = await E(board).getValue(INSTANCE_BOARD_ID);
      console.log("😬😬😬😬😬");
      // const publicFacet = E(zoe).getPublicFacet(instance);
      console.log("😮‍💨😮‍💨😮‍💨😮‍💨😮‍💨");
      // const invitationIssuer = E(zoe).getInvitationIssuer(publicFacet);
      // publicFacetRef.current = "publicFacet";
      // console.log("😮‍💨😮‍💨😮‍💨😮‍💨😮‍💨",{ zoe, board, instance, publicFacet, zoeInvitationDepositFacetId, invitationIssuer, walletP });
      dispatch({ type: "SET_AGORIC", payload: { zoe, board, instance, publicFacet: undefined, zoeInvitationDepositFacetId, invitationIssuer: undefined, walletP } });
      
      // TODO: fetch available characters

      // const availableItemsNotifier = E(
      //   publicFacetRef.current,
      // ).getAvailableItemsNotifier();

      // for await (const cardsAvailableAmount of iterateNotifier(
      //   availableItemsNotifier,
      // )) {
      //   setAvailableCards(cardsAvailableAmount.value);
      // }
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
    return deactivateWebSocket;
  }, []);

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{props.children}</DispatchContext.Provider>
    </Context.Provider>
  );
};

export const useServiceState = (): ServiceState => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("useServiceState can only be called inside a ServiceProvider.");
  }
  return state;
};

export const useServiceStateDispatch = (): React.Dispatch<ServiceStateActions> => {
  const dispatch = useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error("useServiceDispatch can only be called inside a ServiceProvider.");
  }
  return dispatch;
};

export const useServiceContext = (): [ServiceState, Dispatch] => [useServiceState(), useServiceStateDispatch()];