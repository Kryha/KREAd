import { ChainStorageWatcher, AgoricChainStoragePathKind as Kind } from "@agoric/rpc";
import { AgoricDispatch, TokenInfo } from "../../interfaces";
import { ITEM_IDENTIFIER, IST_IDENTIFIER, CHARACTER_IDENTIFIER } from "../../constants";
import { WalletContext } from "../../context/wallet";

type WatcherCallback = (value: any) => void;
type ErrorHandler = (log: any) => void;

export const createWatcher = (
  chainStorageWatcher: any,
  path: string,
  onValueUpdate: WatcherCallback,
  onError: ErrorHandler
) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");

  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      onValueUpdate(value);
    },
    onError
  );
};

export const watchBrandsVBank = (chainStorageWatcher: any, agoricDispatch: AgoricDispatch) => {
  const path = "published.agoricNames.brand";

  createWatcher(
    chainStorageWatcher,
    path,
    (value) => {
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
      for (const i of value) {
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
      agoricDispatch({ type: "SET_TOKEN_INFO", payload });
    },
    (log: any) => {
      console.error("Error watching vbank assets", log);
    }
  );
};

export const watchWalletVstorage = (
  chainStorageWatcher: any,
  walletAddress: string,
  updateStatePurses: any,
  updateStateOffers: any
) => {
  if (!walletAddress) return;
  const path = `published.wallet.${walletAddress}.current`;

  createWatcher(
    chainStorageWatcher,
    path,
    (value) => {
      updateStateOffers(value.liveOffers);
      updateStatePurses(value.purses);
    },
    (log: any) => {
      console.error("Error watching vbank assets", log);
    },
  );
};

export const watchKreadInstance = (chainStorageWatcher: any, agoricDispatch: AgoricDispatch) => {
  const path = "published.agoricNames.instance";

chainStorageWatcher.watchLatest(
  [Kind.Data, path],
  (value: any) => {
    console.debug("got update", path, value);
    if (!value) {
      console.warn(`${path} returned undefined`);
      return;
    }
    const instance = value.filter((i: any) => i[0] === "kread");
    agoricDispatch({ type: "SET_KREAD_INSTANCE", payload: instance[0][1] });
  },
  (log: any) => {
    console.error("Error watching vbank assets", log);
  },)
};

export const watchExistingCharacterPaths = (
  chainStorageWatcher: ChainStorageWatcher,
  walletDispatch: (value: React.SetStateAction<WalletContext>) => void,
) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.kread.character";
  chainStorageWatcher.watchLatest(
    [Kind.Children, path],
    async (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }

      const characterNameList = value.map((char: string) => char.substring(10));

      walletDispatch((prevState) => ({
        ...prevState,
        characterNameList,
      }));
    },
    (log: any) => {
      console.error("Error watching kread char market", log);
    },
  );
};