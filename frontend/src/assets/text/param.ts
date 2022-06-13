export const param = {
  amountOfItems: (amount: number | string) => `${amount} items`,
  itemId: (id: number | string) => `#${id}`,
  ownedBy: (owner: string) => `owned by ${owner}`,
  oneOutOf: (rarity: number | string) => `1 / ${rarity}`,
  runPrice: (run: number | string) => `RUN ${run}`,
  nOutOfOnehundred: (n: number | string) => `${n} / 100`,
  withZeroPrefix: (n: number) => (n.toString().length === 1 ? `0${n}` : n),
  level: (n: number | string) => `Lvl. ${n}`,
};
