import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect } from "react";
import { observeIteration, makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";

import { useAgoricState } from "./agoric";

import dappConstants from "../service/ag-solo-connection/conf/defaults";
import { CHARACTER_IDENTIFIER, IST_IDENTIFIER } from "../constants";
import { watchPursesNonVbank } from "../service/storage-node/watch-general";
import { useUserStateDispatch } from "./user";

const { brandBoardIds } = dappConstants;
export interface WalletContext {
  token: any;
  money: any;
  character: any;
  item: any;
  fetched: boolean;
}

const initialState: WalletContext = {
  token: undefined,
  money: undefined,
  character: undefined,
  item: undefined,
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
      //FIXME: this is not going to work when a users has more than 1 item that is the same (then it will be 2n)
      // Consider creating an array that fills an array n amount of times based onthe amount the user owns
      const itemWallet = newItemPurses[newItemPurses.length - 1]?.balance.value.payload.map((i: any) => i[0]);
      const tokenWallet = newTokenPurses[newTokenPurses.length - 1]?.balance.value;

      const itemsAdjustedIdType = itemWallet.map((item: any) => ({...item, id: Number(item.id)}));

      walletDispatch((prevState) => ({
        ...prevState,
        token: tokenWallet,
        character: characterWallet,
        item: itemsAdjustedIdType,
      }));

      // userDispatch({
      //   type: "SET_CHARACTERS",
      //   payload: characterWallet,
      // })
      
    };
    const updateStateVbank = async (purses: any) => {
      console.count("💾 LOADING PURSE CHANGE 💾");

      // Load Purses
      const newMoneyPurses = purses.filter(({ brandPetname }: any) => brandPetname === IST_IDENTIFIER);
      const moneyWallet = newMoneyPurses[newMoneyPurses.length - 1]?.currentAmount;

      walletDispatch((prevState) => ({
        ...prevState,
        money: moneyWallet,
      }));
    };

    const watchPurses = async () => {
      console.info("✅ LISTENING FOR PURSE CHANGES", pursesNotifier);
      const watch = async () => {
        for await (const purses of iterateNotifier(pursesNotifier)) {
          if (isCancelled) return;
          updateStateVbank(purses);
        }
      };
      watch().catch((err: Error) => {
        console.error("got watchPurses err", err);
      });
    };
    if (pursesNotifier && !walletState.fetched && chainStorageWatcher) {
      watchPurses().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
    }

    if (!walletState.fetched && chainStorageWatcher) {
      watchPursesNonVbank(chainStorageWatcher, walletAddress, updateStateNonVbank);
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
