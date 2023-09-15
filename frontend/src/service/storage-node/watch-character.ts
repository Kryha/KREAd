import { AgoricChainStoragePathKind as Kind } from "@agoric/rpc";
import { AgoricDispatch } from "../../interfaces";

/* TODO: SMART-WALLET SUPPPRT

Use chain-storage-watcher to get updates on relevant characters,
including inventory information. Should write to the User context
and potentially be triggered by that same context in a useEffect.
Alternatively it could be triggered by the first interface that
consumes the User context

Commneted code is dapp-inter's implementation
(https://github.com/Agoric/dapp-inter/blob/main/src/service/vbank.ts)
*/
export const watchCharacterInventory = (chainStorageWatcher: any, characterName: string, agoricDispatch: AgoricDispatch) => {
  assert(chainStorageWatcher, "chainStorageWatcher not initialized");
  const path = `published.kread.inventory-${characterName}`;

  chainStorageWatcher.watchLatest(
    [Kind.Data, path],
    (value: any) => {
      console.debug("got update", path, value);
      if (!value) {
        console.warn(`${path} returned undefined`);
        return;
      }

      agoricDispatch({ type: "SET_TEST_CHARACTER", payload: value.map((i) => i[0]) });
    },
    (log) => {
      console.error("Error watching vbank kread character inventory", log);
    },
  );
};
