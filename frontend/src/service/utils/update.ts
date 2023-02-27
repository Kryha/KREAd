import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import { iterateLatest, makeFollower, Leader } from '@agoric/casting';
// import { dappConfig } from 'config';
// import type { Metrics, GovernedParams, BrandInfo } from 'store/app';
import type { Marshal } from '@endo/marshal';
import '@agoric/wallet-backend/src/types';
import { PursesJSONState } from '@agoric/wallet-backend';

declare type ContractSetters = {
  setInstanceIds: (ids: [string, string][]) => void;
  setMetricsIndex: (metrics: [string, Metrics][]) => void;
  setGovernedParamsIndex: (params: [string, GovernedParams][]) => void;
};

export const watchPurses = async (
  chainConnection: { pursesNotifier: any },
  setPurses: (purses: PursesJSONState[]) => void,
  mergeBrandToInfo: (entries: Iterable<Iterable<any>>) => void
) => {
  const n = chainConnection.pursesNotifier;
  for await (const purses of iterateNotifier(n)) {
    setPurses(purses);

    for (const purse of purses as PursesJSONState[]) {
      const { brand, displayInfo, brandPetname: petname } = purse;
      const decimalPlaces = displayInfo && displayInfo.decimalPlaces;
      const assetKind = displayInfo && displayInfo.assetKind;
      const newInfo: BrandInfo = {
        petname,
        assetKind,
        decimalPlaces,
      };

      mergeBrandToInfo([[brand, newInfo]]);
    }
  }
};
