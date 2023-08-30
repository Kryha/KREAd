import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect } from "react";
import { observeIteration, makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";

import { useAgoricState } from "./agoric";

import dappConstants from "../service/ag-solo-connection/conf/defaults";
import { CHARACTER_IDENTIFIER, IST_IDENTIFIER, SELL_ITEM_INVITATION, SELL_CHARACTER_INVITATION } from "../constants";
import { watchWalletVstorage } from "../service/storage-node/watch-general";
import { useUserStateDispatch } from "./user";

const { brandBoardIds } = dappConstants;
export interface WalletContext {
  token: any;
  money: any;
  character: any;
  item: any;
  itemProposals: { give: Object; want: Object }[];
  characterProposals: { give: Object; want: Object }[];
  fetched: boolean;
}

const initialState: WalletContext = {
  token: undefined,
  money: undefined,
  character: undefined,
  item: undefined,
  itemProposals: [],
  characterProposals: [],
  fetched: false,
};

const Context = createContext<WalletContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<WalletContext>, "value">;

export const WalletContextProvider = (props: ProviderProps): React.ReactElement => {
  const [walletState, walletDispatch] = useState<WalletContext>(initialState);
  // const userDispatch = useUserStateDispatch();
  const agoric = useAgoricState();
  const pursesNotifier = agoric.walletConnection.pursesNotifier;
  const chainStorageWatcher = agoric.chainStorageWatcher;
  const walletAddress = agoric.walletConnection.address;
  const tokenInfo = agoric.tokenInfo;

  useEffect(() => {
    let isCancelled = false;

    const updateStateNonVbank = async (purses: any) => {
      console.count("💾 LOADING PURSE CHANGE 💾");

      // Load Purses
      // TODO: remove token
      const newTokenPurses = purses.filter(({ brand }: any) => brand === brandBoardIds.Token);
      const newCharacterPurses = purses.filter(({ brand }: any) => brand === tokenInfo.character.brand);
      const newItemPurses = purses.filter(({ brand }: any) => brand === tokenInfo.item.brand);
      const characterWallet = newCharacterPurses[newCharacterPurses.length - 1]?.balance.value.payload.map((i: any) => i[0]);
      // FIXME: this is not going to work when a users has more than 1 item that is the same (then it will be 2n)
      // Consider creating an array that fills an array n amount of times based onthe amount the user owns
      let itemWallet = newItemPurses[newItemPurses.length - 1]?.balance.value.payload.map((i: any) => i[0]);
      const tokenWallet = newTokenPurses[newTokenPurses.length - 1]?.balance.value;

      if(itemWallet){
        itemWallet = itemWallet.map((item: any) => ({ ...item, id: Number(item.id) }));
      }

      walletDispatch((prevState) => ({
        ...prevState,
        token: tokenWallet,
        character: characterWallet,
        item: itemWallet,
      }));
    };

    const updateStateOffers = async (offers: any) => {
      console.count("💾 LOADING OFFER CHANGE 💾");
      const itemProposals: { give: Object; want: Object }[] = [];
      const characterProposals: { give: Object; want: Object }[] = [];
      offers.forEach((offer: any) => {
        const {
          proposal: { give, want },
          invitationSpec: { publicInvitationMaker, instance },
        } = offer[1];
        if (instance === agoric.contracts.kread.instance) {
          if (publicInvitationMaker === SELL_ITEM_INVITATION) {
            itemProposals.push({ want, give });
          } else if (publicInvitationMaker === SELL_CHARACTER_INVITATION) {
            characterProposals.push({ want, give });
          }
        }
      });

      walletDispatch((prevState) => ({
        ...prevState,
        itemProposals,
        characterProposals,
      }));
    };

    if (!walletState.fetched && chainStorageWatcher) {
      watchWalletVstorage(chainStorageWatcher, walletAddress, updateStateNonVbank, updateStateOffers);
    }

    return () => {
      isCancelled = true;
    };
  }, [pursesNotifier, walletState.fetched]);

  return <Context.Provider value={walletState}>{props.children}</Context.Provider>;
};

export const useWalletState = (): WalletContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("WalletState can only be called inside WalletStateProvider.");
  }
  return state;
};
