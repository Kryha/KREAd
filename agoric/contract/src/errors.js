export const errors = {
  noConfig: `Configuration not found, use creatorFacet.initConfig(<config>) to enable this method`,
  noNameArg: `Name argument required`,
  nameTaken: (name) =>
    `Name ${name} is already in use, please select a different name`,
  depositToSeatFailed: `Could not deposit nft into Seat`,
  depositToFacetFailed: `Could not deposit nft into userFacet`,
};
