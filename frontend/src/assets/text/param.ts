export const param = {
  amountOfItems: (amount: number | string) => `${amount} items`,
  id: (id: number | string) => `#${id}`,
  ownedBy: (owner: string) => `owned by ${owner}`,
  oneOutOf: (rarity: number | string) => `1 / ${rarity}`,
  istPrice: (ist: number | string) => `IST ${ist}`,
  nOutOfOnehundred: (n: number | string) => `${n} / 100`,
  withZeroPrefix: (n: number) => (n.toString().length === 1 ? `0${n}` : n),
  notificationSold: (price: number) => `has been sold. IST ${price} is transfered to your wallet.`,
  itemQuoted: (itemName: string) => `${itemName}`,
  theItemIsUpForSale: (itemName: string, price: number) =>
    `the '${itemName}' is up for sale in the shop now ... As soon as it's sold, you'll receive ${price} IST and be notified your item has sold`,
  yourItemHasBeenSold: (itemName: string, price: number) =>
    `your item '${itemName}' has been sold. IST ${price} is transfered to your wallet.`,
  theItemIsSussfullyPurchased: (itemName: string) => `the '${itemName}' has been successfully purchased from the shop.`,
  level: (level: number) => `lvl. ${level}`,
  amountOfCharacters: (amount: number | string) => `${amount} characters`,
  forSale: (price: number) => `for sale ${price}`,
  // TODO: add character categories
  categories: {
    noseline: "noseline",
    midBackground: "mid background",
    mask: "mask",
    headPiece: "head piece",
    hair: "hair",
    airReservoir: "air reservoir",
    liquid: "liquid",
    background: "background",
    frontMask: "front mask",
    clothing: "clothing",
    tempetScavenger: "tempet scavenger"
  },
};
