import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";
import { AgoricDispatch, TokenInfo } from "../../interfaces";
import { ITEM_IDENTIFIER, IST_IDENTIFIER, CHARACTER_IDENTIFIER } from "../../constants";

/* TODO: SMART-WALLET SUPPPRT

Use chain-storage-watcher to get updates on relevant characters,
including inventory information. Should write to the User context
and potentially be triggered by that same context in a useEffect.
Alternatively it could be triggered by the first interface that
consumes the User context

Commneted code is dapp-inter's implementation
(https://github.com/Agoric/dapp-inter/blob/main/src/service/vbank.ts)
*/

export const watchBrandsVBank = (chainStorageWatcher: any, agoricDispatch: AgoricDispatch) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.agoricNames.brand";

  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
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
    (log) => {
      console.error("Error watching vbank assets", log);
    }
  );
};

export const watchWalletVstorage = (chainStorageWatcher: any, walletAddress: string, updateStatePurses: any, updateStateOffers: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = `published.wallet.${walletAddress}.current`;

  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      updateStateOffers(value.liveOffers);
      updateStatePurses(value.purses);
    },
    (log) => {
      console.error("Error watching vbank assets", log);
    }
  );
};

export const watchKreadInstance = (chainStorageWatcher: any, agoricDispatch: AgoricDispatch) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.agoricNames.instance";

  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      const instance = value.filter((i) => i[0] === "kread");
      agoricDispatch({ type: "SET_KREAD_CONTRACT", payload: { instance: instance[0][1], publicFacet: undefined } });
    },
    (log) => {
      console.error("Error watching vbank assets", log);
    }
  );
};
