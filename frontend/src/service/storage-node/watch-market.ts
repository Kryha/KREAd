import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";

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
