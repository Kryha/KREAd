import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect } from "react";
import { observeIteration } from "@agoric/notifier";
import { useAgoricState } from "./agoric";

import dappConstants from "../service/conf/defaults";

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
  const agoric = useAgoricState();
  const kreadPublicFacet = agoric.contracts.characterBuilder.publicFacet;
  const pursesNotifier = agoric.walletConnection.pursesNotifier

  useEffect(() => {
    const observer = harden({
      updateState: (purses: any) => {
        console.count("💾 LOADING PURSE CHANGE 💾");

        // Load Purses
        const newMoneyPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Money);
        const newTokenPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Token);
        const newCharacterPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Character);
        const newItemPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Item);

        const characterWallet = newCharacterPurses[newCharacterPurses.length - 1];
        const itemWallet = newItemPurses[newItemPurses.length - 1];
        const moneyWallet = newMoneyPurses[newCharacterPurses.length - 1];
        const tokenWallet = newTokenPurses[newItemPurses.length - 1];

        walletDispatch((prevState) => ({
          ...prevState,
          token: tokenWallet,
          money: moneyWallet,
          character: characterWallet,
          item: itemWallet,
        }));
      },
      finish: (completion: unknown) => console.info("WALLET NOTIFIER FINISHED", completion),
      fail: (reason: unknown) => console.info("WALLET NOTIFIER ERROR", reason),
    });

    const watchPurses = async () => {
      console.info("✅ LISTENING FOR PURSE CHANGES");

      observeIteration(pursesNotifier, observer);
      walletDispatch((prevState) => ({
        ...prevState,
        fetched: true,
      }));
    };

    if (pursesNotifier && kreadPublicFacet && !walletState.fetched) {
      watchPurses().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
    }
  }, [pursesNotifier, kreadPublicFacet, walletState.fetched]);

  return <Context.Provider value={walletState}>{props.children}</Context.Provider>;
};

export const useWalletState = (): WalletContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("WalletState can only be called inside WalletStateProvider.");
  }
  return state;
};
