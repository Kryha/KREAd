/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "@agoric/assert";
declare module "@endo/captp";
declare module "@agoric/ertp";
declare module "@agoric/store";
declare module "@agoric/ui-components";
declare module "@endo/marshal" {
  export type Marshal = any;
}
declare module "@agoric/notifier";
declare module "@agoric/casting" {
  export type Leader = any;
  export const makeFollower;
  export const iterateLatest;
  export const makeLeader;
}
declare module "@endo/lockdown" {
  export const lockdown;
}

declare module "@agoric/wallet-backend" {
  export type PursesJSONState = {
    brand: import("@agoric/ertp").Brand;
    /** The board ID for this purse's brand */
    brandBoardId: string;
    /** The board ID for the deposit-only facet of this purse */
    depositBoardId?: string;
    /** The petname for this purse's brand */
    brandPetname: Petname;
    /** The petname for this purse */
    pursePetname: Petname;
    /** The brand's displayInfo */
    displayInfo: any;
    /** The purse's current balance */
    value: any;
    currentAmountSlots: any;
    currentAmount: any;
  };
}
