/* TODO: SMART-WALLET SUPPPRT

Use chain-storage-watcher to get updates on relevant characters,
including inventory information. Should write to the User context
and potentially be triggered by that same context in a useEffect.
Alternatively it could be triggered by the first interface that
consumes the User context

Commneted code is dapp-inter's implementation 
(https://github.com/Agoric/dapp-inter/blob/main/src/service/vbank.ts)
*/

export const watchCharacter = '';
// import type { DisplayInfo, Brand } from '@agoric/ertp/src/types';
// import { AgoricChainStoragePathKind as Kind } from 'rpc';
// import { useAgoricState } from '../../context/agoric';

// type VbankInfo = {
//   brand: Brand;
//   displayInfo: DisplayInfo<'nat'>;
//   issuerName: string;
// };

// type VbankUpdate = Array<[string, VbankInfo]>;

// export const watchCharacter = () => {
//   const { chainStorageWatcher } = useAgoricState()
//   assert(chainStorageWatcher, 'chainStorageWatcher not initialized');

//   const path = 'published.agoricNames.vbankAsset';

//   chainStorageWatcher.watchLatest<VbankUpdate>(
//     [Kind.Data, path],
//     value => {
//       console.debug('got update', path, value);
//       if (!value) {
//         appStore.setState({
//           watchVbankError: `${path} returned undefined`,
//         });
//         return;
//       }

//       const brandToInfo = new Map(
//         value.map(entry => [
//           entry[1].brand,
//           { ...entry[1].displayInfo, petname: entry[1].issuerName },
//         ]),
//       );
//       appStore.setState({ brandToInfo });
//     },
//     log => {
//       console.error('Error watching vbank assets', log);
//       appStore.setState({
//         watchVbankError: 'Error loading asset display info',
//       });
//     },
//   );
// };
