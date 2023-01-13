import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect } from "react";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { useAgoricState } from "./agoric";

import dappConstants from "../service/conf/defaults";

const {
  brandBoardIds
} = dappConstants;
export interface WalletContext {
  token: any[],
  money: any[],
  character: any[],
  item: any[],
  fetched: boolean,
}

const initialState: WalletContext = {
  token: [],
  money: [],
  character: [],
  item: [],
  fetched: false,
};

const Context = createContext<WalletContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<WalletContext>, "value">;

export const WalletContextProvider = (props: ProviderProps): React.ReactElement => {
  const [walletState, walletDispatch] = useState<WalletContext>(initialState);
  const agoric = useAgoricState();
  const kreadPublicFacet = agoric.contracts.characterBuilder.publicFacet; 
  const walletP = agoric.agoric.walletP;

  useEffect(() => {
    const watchPurses = async () => {
      console.info("✅ LISTENING FOR PURSE CHANGES");
      const pn = E(walletP).getPursesNotifier();

      for await (const purses of iterateNotifier(pn)) {
        console.count("💾 LOADING PURSE CHANGE 💾");

        // Load Purses
        const newMoneyPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Money);
        const newTokenPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Token);
        const newCharacterPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Character);
        const newItemPurses = purses.filter(({ brandBoardId }: any) => brandBoardId === brandBoardIds.Item);
        
        walletDispatch(prevState => ({
          ...prevState,
          token: newTokenPurses,
          money: newMoneyPurses,
          character: newCharacterPurses,
          item: newItemPurses,
        }));
      }
    };
    if (walletP && kreadPublicFacet) {
      watchPurses().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
    }
    return () => {
      walletDispatch(initialState);
    };
  }, [walletP, kreadPublicFacet]);
  
  return (
    <Context.Provider value={walletState}>
      {props.children}
    </Context.Provider>
  );
};

export const useWalletState = (): WalletContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("WalletState can only be called inside WalletStateProvider.");
  }
  return state;
};