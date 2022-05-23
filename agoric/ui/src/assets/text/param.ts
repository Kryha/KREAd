export const param = {
  amountOfItems: (amount: number | string) => `${amount} items`,
  itemId: (id: number | string) => `#${id}`,
  ownedBy: (owner: string) => `owned by ${owner}`,
  oneOutOf: (rarity: number | string) => `1 / ${rarity}`,
  runPrice: (run: number | string) => `RUN ${run}`,
};
