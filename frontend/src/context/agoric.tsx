/// <reference types="ses"/>
import React, { createContext, useReducer, useContext, useEffect, useRef } from "react";
import { Far } from "@endo/marshal";
import { makeCapTP, E } from "@endo/captp";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import dappConstants from "../service/conf/defaults";

import { activateWebSocket, deactivateWebSocket, getActiveSocket } from "../service/utils/fetch-websocket";
import { connect } from "../service/lib/connect";
import { apiRecv } from "../service/api/receive";
import { processPurses } from "../service/purses/process";
import { useCharacterStateDispatch } from "./characters";
import { useItemStateDispatch } from "./items";

import { AgoricDispatch, AgoricState, AgoricStateActions } from "../interfaces/agoric.interfaces";
// import { NotificationWrapper } from "../components/notification-card/styles";

const {
  INSTANCE_NFT_MAKER_BOARD_ID,
  INVITE_BRAND_BOARD_ID,
  INSTALLATION_BOARD_ID,
  issuerBoardIds: { Character: CHARACTER_ISSUER_BOARD_ID, Item: ITEM_ISSUER_BOARD_ID, InventoryKey: INVENTORY_KEY_ISSUER_BOARD_ID },
  brandBoardIds: {
    Money: MONEY_BRAND_BOARD_ID,
    Character: CHARACTER_BRAND_BOARD_ID,
    Item: ITEM_BRAND_BOARD_ID,
    InventoryKey: INVENTORY_KEY_BRAND_BOARD_ID,
  },
} = dappConstants;

console.info(`DAPP CONSTANTS: ${dappConstants}`);

const initialState: AgoricState = {
  status: {
    walletConnected: false,
    dappApproved: false,
    showApproveDappModal: false,
  },
  purses: {
    money: [],
    character: [],
    item: [],
    inventoryKey: [],
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
    characterBuilder: {
      instance: undefined,
      publicFacet: undefined,
    },
    auctions: [],
  },
  isLoading: false,
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

    case "SET_TOKEN_PURSES":
      return { ...state, purses: { ...state.purses, money: action.payload } };

    case "SET_CHARACTER_PURSES":
      return { ...state, purses: { ...state.purses, character: action.payload } };

    case "SET_ITEM_PURSES":
      return { ...state, purses: { ...state.purses, item: action.payload } };

    case "SET_INVENTORY_KEY_PURSES":
      return { ...state, purses: { ...state.purses, inventoryKey: action.payload } };

    case "SET_AGORIC":
      return { ...state, agoric: { ...state.agoric, ...action.payload } };

    case "SET_APISEND":
      return { ...state, agoric: { ...state.agoric, apiSend: action.payload } };

    case "SET_CHARACTER_CONTRACT":
      return { ...state, contracts: { ...state.contracts, characterBuilder: action.payload } };

    case "ADD_AUCTION_CONTRACT":
      return { ...state, contracts: { ...state.contracts, auctions: [...state.contracts.auctions, action.payload] } };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "RESET":
      return initialState;

    default:
      throw new Error("Only defined action types can be handled;");
  }
};

export const AgoricStateProvider = (props: ProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const characterDispatch = useCharacterStateDispatch();
  const itemDispatch = useItemStateDispatch();
  const walletPRef = useRef(undefined);

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

    let walletAbort: () => any;
    let walletDispatch: (arg0: any) => any;

    const onConnect = async () => {
      console.info("Connecting to wallet...");

      const rawApiSend = await connect("/api/nft-maker", apiRecv, { characterDispatch });
      dispatch({ type: "SET_APISEND", payload: rawApiSend });

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

      async function watchPurses() {
        const pn = E(walletP).getPursesNotifier();
        for await (const purses of iterateNotifier(pn)) {
          console.info("🧐 CHECKING PURSES");
          processPurses(purses, characterDispatch, itemDispatch, dispatch, {
            money: MONEY_BRAND_BOARD_ID,
            character: CHARACTER_BRAND_BOARD_ID,
            item: ITEM_BRAND_BOARD_ID,
            inventoryKey: INVENTORY_KEY_BRAND_BOARD_ID,
          });
        }
      }
      watchPurses().catch((err) => {
        console.error("got watchPurses err", err);
      });

      async function watchOffers() {
        const on = E(walletP).getOffersNotifier();
        for await (const offer of iterateNotifier(on)) {
          console.info("📡 OFFER UPDATE");
          const last3 = offer.slice(-3);
          console.info(last3);
        }
      }
      watchOffers().catch((err) => {
        console.error("got watchOffers err", err);
      });

      // Suggest installation and brands to wallet
      await Promise.all([
        E(walletP).suggestInstallation("Installation NFT", INSTANCE_NFT_MAKER_BOARD_ID),
        E(walletP).suggestInstallation("Installation", INSTALLATION_BOARD_ID),
        E(walletP).suggestIssuer("KREA", CHARACTER_ISSUER_BOARD_ID),
        E(walletP).suggestIssuer("KREAITEM", ITEM_ISSUER_BOARD_ID),
        E(walletP).suggestIssuer("KREAINVENTORYEKEY", INVENTORY_KEY_ISSUER_BOARD_ID),
      ]);

      // Initialize agoric service based on constants
      const zoeInvitationDepositFacetId = await E(walletP).getDepositFacetId(INVITE_BRAND_BOARD_ID);
      const zoe = E(walletP).getZoe();
      const board = E(walletP).getBoard();
      const instanceNft = await E(board).getValue(INSTANCE_NFT_MAKER_BOARD_ID);
      const nftPublicFacet = await E(zoe).getPublicFacet(instanceNft);
      const invitationIssuer = E(zoe).getInvitationIssuer(nftPublicFacet);
      dispatch({ type: "SET_AGORIC", payload: { zoe, board, zoeInvitationDepositFacetId, invitationIssuer, walletP } });
      dispatch({ type: "SET_CHARACTER_CONTRACT", payload: { instance: instanceNft, publicFacet: nftPublicFacet } });

      // Fetch Characters from Chain
      const nfts = await E(nftPublicFacet).getCharacters();
      characterDispatch({ type: "SET_CHARACTERS", payload: nfts.characters });

      // Fetch Items from Chain
      const walletItems = await E(nftPublicFacet).getItems();
      console.log("Ag Context walletItems: ", walletItems);
      itemDispatch({ type: "SET_ITEMS", payload: walletItems.items });

      // TODO: set up chain notifiers
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
  }, [characterDispatch, itemDispatch]);

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
