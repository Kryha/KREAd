import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";

export const parseItemMarket = async (chainStorageWatcher: any, paths: string[], parseMarketUpdate: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const values = await Promise.all(
    paths.map((path) => {
      return chainStorageWatcher.queryOnce([Kind.Data, `published.kread.market-items.${path}`]);
    }),
  );
  await parseMarketUpdate(values);
};

export const parseCharacterMarket = async (chainStorageWatcher: any, paths: string[], parseMarketUpdate: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const values = await Promise.all(
    paths.map((path) => {
      return chainStorageWatcher.queryOnce([Kind.Data, `published.kread.market-characters.${path}`]);
    }),
  );
  await parseMarketUpdate(values);
};

export const watchItemMarketMetrics = async (chainStorageWatcher: any, parseItemMarketMetricsUpdate: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.kread.market-metrics-item";
  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    async (value: any) => {
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      await parseItemMarketMetricsUpdate(value);
    },
    (log: any) => {
      console.error("Error watching kread char market", log);
    },
  );
};

export const watchCharacterMarketMetrics = async (chainStorageWatcher: any, parseCharacterMarketMetricsUpdate: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.kread.market-metrics-character";
  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    async (value: any) => {
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      await parseCharacterMarketMetricsUpdate(value);
    },
    (log: any) => {
      console.error("Error watching kread char market", log);
    },
  );
};

export const watchCharacterMarketPaths = (chainStorageWatcher: any, addMarketCharacterPaths: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.kread.market-characters";
  chainStorageWatcher.watchLatest(
    [Kind.Children, path],
    async (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      await addMarketCharacterPaths(value);
    },
    (log: any) => {
      console.error("Error watching kread char market", log);
    },
  );
};

export const watchItemMarketPaths = (chainStorageWatcher: any, addMarketItemPaths: any) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = "published.kread.market-items";
  chainStorageWatcher.watchLatest(
    [Kind.Children, path],
    async (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }
      await addMarketItemPaths(value);
    },
    (log: any) => {
      console.error("Error watching kread item market", log);
    },
  );
};
