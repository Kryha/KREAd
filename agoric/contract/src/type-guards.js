import { M } from '@agoric/store';
import { BrandShape, IssuerShape } from '@agoric/ertp';

export const HelperI = M.interface(
  'helper',
  {},
  // not exposed so sloppy okay
  { sloppy: true },
);

export const BaseCharacterGuard = M.splitRecord({
  title: M.string(),
  description: M.string(),
  origin: M.string(),
  level: M.gte(0),
  artistMetadata: M.string(),
  image: M.string(),
  characterTraits: M.string(),
});

export const CharacterGuard = M.splitRecord({
  title: M.string(),
  description: M.string(),
  origin: M.string(),
  level: M.gte(0),
  artistMetadata: M.string(),
  image: M.string(),
  characterTraits: M.string(),
  name: M.string(),
  keyId: M.number(),
  id: M.gte(0),
  date: M.record(),
});

export const CharacterGuardBagShape = M.bagOf(CharacterGuard);

export const ItemGuard = M.splitRecord({
  name: M.string(),
  category: M.or(
    'hair',
    'headPiece',
    'mask',
    'filter1',
    'filter2',
    'perk1',
    'perk2',
    'garment',
    'patch',
    'background',
  ),
  description: M.string(),
  functional: M.boolean(),
  image: M.string(),
  thumbnail: M.string(),
  rarity: M.gte(0),
  level: M.gte(0),
  filtering: M.gte(0),
  weight: M.gte(0),
  sense: M.gte(0),
  reserves: M.gte(0),
  durability: M.gte(0),
  colors: M.arrayOf(M.string()),
  artistMetadata: M.string(),
});

export const RarityGuard = M.or(
  'common',
  'uncommon',
  'rare',
  'legendary',
  'exotic',
);

export const ItemGuardBagShape = M.bagOf(ItemGuard);

export const MarketMetricsGuard = M.splitRecord({
  amountSold: M.gte(0),
  collectionSize: M.gte(0),
  averageLevel: M.gte(0),
  marketplaceAverageLevel: M.gte(0),
});

export const UpdateMarketMetricsGuard = M.splitRecord(
  {},
  {
    amountSold: M.boolean(),
    collectionSize: M.boolean(),
    averageLevel: M.splitRecord({
      type: M.or('add', 'remove'),
      value: M.gte(0),
    }),
    marketplaceAverageLevel: M.splitRecord({
      type: M.or('add', 'remove'),
      value: M.gte(0),
    }),
  },
);

export const PublicI = M.interface('public', {
  // Mint
  makeMintCharacterInvitation: M.call().returns(M.promise()),
  makeMintItemInvitation: M.call().returns(M.promise()),
  makeTokenFacetInvitation: M.call().returns(M.promise()),
  // Inventory
  makeEquipInvitation: M.call().returns(M.promise()),
  makeUnequipInvitation: M.call().returns(M.promise()),
  makeUnequipAllInvitation: M.call().returns(M.promise()),
  makeItemSwapInvitation: M.call().returns(M.promise()),
  // Market
  makeSellCharacterInvitation: M.call().returns(M.promise()),
  makeBuyCharacterInvitation: M.call().returns(M.promise()),
  makeSellItemInvitation: M.call().returns(M.promise()),
  makeBuyItemInvitation: M.call().returns(M.promise()),
  // Getters
  getTokenInfo: M.call().returns(
    M.splitRecord({
      character: { issuer: IssuerShape, brand: BrandShape },
      item: { issuer: IssuerShape, brand: BrandShape },
      payment: { issuer: IssuerShape, brand: BrandShape },
    }),
  ),
  getCharacters: M.call().returns(M.array()),
  getCharacterInventory: M.call().returns(M.splitRecord({ items: M.array() })),
  getCharactersForSale: M.call().returns(M.array()),
  getItemsForSale: M.call().returns(M.array()),
  getMarketMetrics: M.call().returns(M.record()),
  getCharacterLevel: M.call(M.string()).returns(M.gte(0)),
});

export const CreatorI = M.interface('creator', {
  publishKreadInfo: M.call().returns(),
  makeMintItemInvitation: M.call().returns(M.promise()),
  initializeMetrics: M.call().returns(),
  initializeBaseAssets: M.call(
    M.arrayOf([M.number(), BaseCharacterGuard]),
    M.arrayOf(ItemGuard),
  ).returns(),
});

export const CharacterI = M.interface('character', {
  mint: M.call().returns(M.promise()),
  equip: M.call().returns(M.promise()),
  unequip: M.call().returns(M.promise()),
  unequipAll: M.call().returns(M.promise()),
  swap: M.call().returns(M.promise()),
  validateInventoryState: M.call().returns(),
  isNameUnique: M.call(M.string()).returns(M.boolean()),
  getRandomBaseIndex: M.call().returns(M.any()),
  calculateLevel: M.call(M.string()).returns(M.gte(0)),
  makeInventoryRecorderKit: M.call(M.string()).returns(
    M.promise(M.remotable('Notifier')),
  ),
  initializeBaseCharacters: M.call(
    M.arrayOf([M.number(), BaseCharacterGuard]),
  ).returns(),
});

export const ItemI = M.interface('item', {
  mint: M.call().returns(M.promise()),
  mintDefaultBatch: M.call().returns(M.promise(M.string())),
  initializeBaseItems: M.call(M.arrayOf(ItemGuard)).returns(),
});

export const MarketI = M.interface('market', {
  sellItem: M.call().returns(M.promise()),
  buyItem: M.call().returns(M.promise()),
  sellCharacter: M.call().returns(M.promise()),
  buyCharacter: M.call().returns(M.promise()),
  updateMetrics: M.call(
    M.or('character', 'item'),
    UpdateMarketMetricsGuard,
  ).returns(),
  freeTokens: M.call().returns(M.promise()),
});

export const KreadInfoGuard = M.splitRecord({
  instanceBoardId: M.string(),
  characterBrandBoardId: M.string(),
  characterIssuerBoardId: M.string(),
  itemBrandBoardId: M.string(),
  itemIssuerBoardId: M.string(),
  tokenBrandBoardId: M.string(),
  tokenIssuerBoardId: M.string(),
});

export const HistoryGuard = M.splitRecord({
  type: M.string(),
  data: M.any(),
  timestamp: M.record(),
});

export const CharacterRecorderGuard = M.splitRecord({
  name: M.string(),
  character: CharacterGuard,
  inventory: M.eref(M.remotable('Seat')),
  inventoryKit: M.record(), // TODO: figure out how to type recorderkits
  history: M.arrayOf(HistoryGuard),
});

export const ItemRecorderGuard = M.splitRecord({
  id: M.gte(0),
  item: ItemGuard,
  history: M.arrayOf(HistoryGuard),
});

export const MarketRecorderGuard = M.splitRecord({
  id: M.or(M.gte(0), M.string()),
  seat: M.eref(M.remotable('Seat')),
  askingPrice: M.splitRecord({
    brand: BrandShape,
    value: M.nat(),
  }),
  object: M.or(CharacterGuard, ItemGuard),
  // history: M.arrayOf(HistoryGuard),
});
