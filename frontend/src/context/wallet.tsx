import React, { createContext, useContext, useEffect, useState } from "react";
import { useAgoricState } from "./agoric";
import { IST_IDENTIFIER, SELL_CHARACTER_INVITATION, SELL_ITEM_INVITATION } from "../constants";
import { watchExistingCharacterPaths, watchWalletVstorage } from "../service/storage-node/watch-general";
import { Item, OfferProposal } from "../interfaces";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";

export interface WalletContext {
  token: any;
  ist: bigint;
  characterNameList: string[];
  character: any;
  item: Item[];
  itemProposals: OfferProposal[];
  characterProposals: OfferProposal[];
  fetched: boolean;
}

const initialState: WalletContext = {
  token: [],
  ist: 0n,
  characterNameList: [],
  character: [],
  item: [],
  itemProposals: [],
  characterProposals: [],
  fetched: false,
};

const Context = createContext<WalletContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<WalletContext>, "value">;

export const WalletContextProvider = (props: ProviderProps): React.ReactElement => {
  const [walletState, walletDispatch] = useState<WalletContext>(initialState);
  const agoric = useAgoricState();
  const pursesNotifier = agoric.walletConnection.pursesNotifier;
  const chainStorageWatcher = agoric.chainStorageWatcher;
  const walletAddress = agoric.walletConnection.address;
  const tokenInfo = agoric.tokenInfo;

  useEffect(() => {
    if(!agoric.status.walletProvisioned) {
      console.warn("Smartwallet is not provisioned");
      return;
    }

    const updateStateNonVbank = async (purses: any) => {
      console.count("💾 LOADING PURSE CHANGE 💾");

      // Load Purses
      // TODO: Read IST balance
      const newCharacterPurses = purses.filter(({ brand }: any) => brand === tokenInfo.character.brand);
      const newItemPurses = purses.filter(({ brand }: any) => brand === tokenInfo.item.brand);
      const characterWallet = newCharacterPurses[newCharacterPurses.length - 1]?.balance.value.payload.map((i: any) => i[0]);
      // FIXME: this is not going to work when a users has more than 1 item that is the same (then it will be 2n)
      // Consider creating an array that fills an array n amount of times based onthe amount the user owns
      let itemWallet = newItemPurses[newItemPurses.length - 1]?.balance.value.payload
        .map((i: any) => {
          const itemArray: any = [];
          for (let j = 0; j < Number(i[1]); j++) {
            itemArray.push(i[0]);
          }
          return itemArray;
        })
        .flat();

      if (itemWallet) {
        itemWallet = itemWallet.map((item: any) => ({ ...item, equippedTo: "", forSale: false }));
      }

      walletDispatch((prevState) => ({
        ...prevState,
        character: characterWallet,
        item: itemWallet,
        fetched: true,
      }));
    };

    const updateStateOffers = async (offers: any) => {
      console.count("💾 LOADING OFFER CHANGE 💾");
      const itemProposals: { give: any; want: any }[] = [];
      const characterProposals: { give: any; want: any }[] = [];
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

    const watchVBankAssets = async () => {
      for await (const status of iterateNotifier(agoric.walletConnection.pursesNotifier)) {
        if (status) {
          const ist = status.find(({ brandPetname }: any) => brandPetname === IST_IDENTIFIER);
          const istValue = ist.currentAmount.value;
          walletDispatch((prevState) => ({
            ...prevState,
            ist: istValue,
          }));
        }
      }
    };
    watchVBankAssets().catch((err: Error) => {
      console.error("got status watch err", err);
    });

    if (!walletState.fetched && chainStorageWatcher) {
      if (tokenInfo.character.brand && tokenInfo.item.brand)
        watchWalletVstorage(chainStorageWatcher, walletAddress, updateStateNonVbank, updateStateOffers);
      watchExistingCharacterPaths(chainStorageWatcher, walletDispatch);
    }
  }, [
    pursesNotifier,
    walletState.fetched,
    chainStorageWatcher,
    tokenInfo.character.brand,
    tokenInfo.item.brand,
    agoric.contracts.kread.instance,
    agoric.walletConnection.pursesNotifier,
    agoric.status.walletProvisioned,
    walletAddress,
  ]);

  return <Context.Provider value={walletState}>{props.children}</Context.Provider>;
};

export const useWalletState = (): WalletContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("WalletState can only be called inside WalletStateProvider.");
  }
  return state;
};
