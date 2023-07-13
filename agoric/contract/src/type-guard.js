// TODO: explore M pattern for validation
import { M } from "@agoric/store";

export const KREAdPublicFacet = M.interface('KREAd PublicFacet', {
  makeMintCharacterInvitation: M.call().returns(),
  makeTokenFacetInvitation: M.call().returns(M.boolean()),
  getCharacter: M.call().returns(M.eref(M.promise())),
  getCharacterMarket: M.call().returns(M.promise()),
  getItemMarket: M.call().returns(),
  getCharacterMarketRange: M.call().returns(M.promise()),
  getItemMarketRange: M.call().returns(),
  getInventory: M.call().returns(),
});