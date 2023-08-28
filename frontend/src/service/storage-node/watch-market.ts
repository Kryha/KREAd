import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";

/* TODO: SMART-WALLET SUPPPRT

Use chain-storage-watcher to get updates on relevant characters,
including inventory information. Should write to the User context
and potentially be triggered by that same context in a useEffect.
Alternatively it could be triggered by the first interface that
consumes the User context

Commneted code is dapp-inter's implementation
(https://github.com/Agoric/dapp-inter/blob/main/src/service/vbank.ts)
*/

// export const watchCharacter = '';
// import type { DisplayInfo, Brand } from '@agoric/ertp/src/types';
// import { AgoricChainStoragePathKind as Kind } from 'rpc';
// import { useAgoricState } from '../../context/agoric';

// type VbankInfo = {
//   brand: Brand;
//   displayInfo: DisplayInfo<'nat'>;
//   issuerName: string;
// };

// type VbankUpdate = Array<[string, VbankInfo]>;

export const watchCharacterMarket = (chainStorageWatcher: any, parseCharacterMarketUpdate: any, marshaller: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.kread.market-characters";
  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    async (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      await parseCharacterMarketUpdate(value, marshaller);
    },
    (log) => {
      console.error("Error watching kread char market", log);
    }
  );
};

export const watchItemMarket = (chainStorageWatcher: any, parseItemMarketUpdate: any) => {
  console.log("WATCHING CHARACTERS");
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.kread.market-items";
  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    async (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      await parseItemMarketUpdate(value);
    },
    (log) => {
      console.error("Error watching kread item market", log);
    }
  );
};
