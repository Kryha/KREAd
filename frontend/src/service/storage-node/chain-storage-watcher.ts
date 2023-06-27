/* TODO: SMART-WALLET SUPPPRT

Periodically queries the most recent data from chain storage, batching RPC
requests for efficiency. Test the service works correctly, watch-character.ts 
& watch-shop.ts depend on it.

Commneted code was taken from an older version of dapp-inter, currently no longer
there, consider importing this functionality from @agoric/rpc

(https://github.com/Agoric/dapp-inter/src/rpc | main branch 030de766)
*/

import { AgoricChainStoragePathKind } from '../smart-wallet/types';
import { batchVstorageQuery, keyToPath, pathToKey } from './batch-query';
import type { UpdateHandler } from '../smart-wallet/types';
import type { FromCapData } from '@endo/marshal';

type Subscriber<T> = {
  onUpdate: UpdateHandler<T>;
  onError?: (log: string) => void;
};

const defaults = {
  newPathQueryDelayMs: 20,
  refreshLowerBoundMs: 2000,
  refreshUpperBoundMs: 4000,
};

const randomRefreshPeriod = (
  refreshLowerBoundMs: number,
  refreshUpperBoundMs: number,
) =>
  Math.round(Math.random() * (refreshUpperBoundMs - refreshLowerBoundMs)) +
  refreshLowerBoundMs;

const makePathSubscriber = <T>(
  onUpdate: UpdateHandler<T>,
  onError?: (log: string) => void,
) => ({
  onUpdate,
  onError,
});

/**
 * Periodically queries the most recent data from chain storage, batching RPC
 * requests for efficiency.
 *
 * @param rpcAddr RPC server URL
 * @param chainId the chain id to use
 * @param unserialize CapData unserializer to use
 * @returns
 */
export const makeAgoricChainStorageWatcher = (
  rpcAddr: string,
  chainId: string,
  unserialize: any,
  onError?: (e: Error) => void,
  newPathQueryDelayMs = defaults.newPathQueryDelayMs,
  refreshLowerBoundMs = defaults.refreshLowerBoundMs,
  refreshUpperBoundMs = defaults.refreshUpperBoundMs,
) => {
  // Map of paths to [identifier, value] pairs of most recent response values.
  //
  // The 'identifier' is used to avoid notifying subscribers for already-seen
  // values. For 'data' queries, 'identifier' is the blockheight of the
  // response. For 'children' queries, 'identifier' is the stringified array
  // of children.
  const latestValueCache = new Map<
    string,
    [identifier: string, value: unknown]
  >();

  const watchedPathsToSubscribers = new Map<string, Set<Subscriber<unknown>>>();
  let isNewPathWatched = false;
  let isQueryInProgress = false;
  let nextQueryTimeout: number | null = null;

  const queueNextQuery = () => {
    if (isQueryInProgress || !watchedPathsToSubscribers.size) {
      return;
    }

    if (isNewPathWatched) {
      // If there is any new path to watch, schedule another query very soon.
      if (nextQueryTimeout) {
        window.clearTimeout(nextQueryTimeout);
      }
      nextQueryTimeout = window.setTimeout(queryUpdates, newPathQueryDelayMs);
    } else {
      // Otherwise, refresh after a normal interval.
      nextQueryTimeout = window.setTimeout(
        queryUpdates,
        randomRefreshPeriod(refreshLowerBoundMs, refreshUpperBoundMs),
      );
    }
  };

  const queryUpdates = async () => {
    isQueryInProgress = true;
    nextQueryTimeout = null;
    isNewPathWatched = false;

    const paths = [...watchedPathsToSubscribers.keys()].map(keyToPath);

    if (!paths.length) {
      isQueryInProgress = false;
      return;
    }

    try {
      const data = await batchVstorageQuery(rpcAddr, unserialize, paths);
      watchedPathsToSubscribers.forEach((subscribers, path) => {
        // Path was watched after query fired, wait until next round.
        if (!data[path]) return;

        if (data[path].error) {
          subscribers.forEach(s => {
            const { onError } = s;
            if (onError) {
              onError(harden(data[path].error));
            }
          });
          return;
        }

        const { blockHeight, value } = data[path];
        const lastValue = latestValueCache.get(path);

        if (
          lastValue &&
          (blockHeight === lastValue[0] ||
            (blockHeight === undefined &&
              JSON.stringify(value) === lastValue[0]))
        ) {
          // The value isn't new, don't emit.
          return;
        }

        latestValueCache.set(path, [
          blockHeight ?? JSON.stringify(value),
          value,
        ]);

        subscribers.forEach(s => {
          s.onUpdate(harden(value));
        });
      });
    } catch (e) {
      onError && onError(e as Error);
    } finally {
      isQueryInProgress = false;
      queueNextQuery();
    }
  };

  const stopWatching = (pathKey: string, subscriber: Subscriber<unknown>) => {
    const subscribersForPath = watchedPathsToSubscribers.get(pathKey);
    if (!subscribersForPath?.size) {
      throw new Error(`cannot unsubscribe from unwatched path ${pathKey}`);
    }

    if (subscribersForPath.size === 1) {
      watchedPathsToSubscribers.delete(pathKey);
      latestValueCache.delete(pathKey);
    } else {
      subscribersForPath.delete(subscriber);
    }
  };

  const queueNewPathForQuery = () => {
    if (!isNewPathWatched) {
      isNewPathWatched = true;
      queueNextQuery();
    }
  };

  const watchLatest = <T>(
    path: [AgoricChainStoragePathKind, string],
    onUpdate: (latestValue: T) => void,
    onError?: (log: string) => void,
  ) => {
    const pathKey = pathToKey(path);
    const subscriber = makePathSubscriber(onUpdate, onError);

    const latestValue = latestValueCache.get(pathKey);
    if (latestValue) {
      subscriber.onUpdate(harden(latestValue[1]) as T);
    }

    const samePathSubscribers = watchedPathsToSubscribers.get(pathKey);
    if (samePathSubscribers !== undefined) {
      samePathSubscribers.add(subscriber as Subscriber<unknown>);
    } else {
      watchedPathsToSubscribers.set(
        pathKey,
        new Set([subscriber as Subscriber<unknown>]),
      );
      queueNewPathForQuery();
    }

    return () => stopWatching(pathKey, subscriber as Subscriber<unknown>);
  };

  return {
    watchLatest,
    chainId,
    rpcAddr,
  };
};
