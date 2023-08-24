import { M } from '@agoric/store';
import { AmountShape, BrandShape, IssuerShape } from '@agoric/ertp';

export const HelperI = M.interface(
  'helper',
  {},
  // not exposed so sloppy okay
  { sloppy: true },
);

export const CharacterGuard = M.bagOf({
  name: M.string(),
  title: M.string(),
  description: M.string(),
  level: M.number(),
  details: M.splitRecord({
    boardId: M.string(), // TODO: Remove?
    standard: M.string(), //TODO: Remove?
    artist: M.string(),
    metadata: M.string(),
  }),
  projectDescription: M.string(),
  image: M.string(),
  type: M.string(),
  keyId: M.number(),
  id: M.number(),
  date: M.record(),
});

// This is a split record because the id and date are set after minting
// the rest of the variables are end-user defined when calling mint invitations
export const ItemGuard = M.bagOf(
  M.splitRecord(
    {
      name: M.string(),
      category: M.or(
        'noseline',
        'midBackground',
        'mask',
        'headPiece',
        'hair',
        'frontMask',
        'liquid',
        'background',
        'airReservoir',
        'clothing',
      ),
      description: M.string(),
      image: M.string(),
      thumbnail: M.string(),
      level: M.number(),
      rarity: M.number(),
      effectiveness: M.number(),
      layerComplexity: M.number(),
      forged: M.string(),
      baseMaterial: M.string(),
      colors: M.arrayOf(M.string()),
      projectDescription: M.string(),
      details: M.splitRecord({
        boardId: M.string(), // TODO: Remove?
        brand: M.string(), // TODO: Remove?
        artist: M.string(),
        metadata: M.string(),
      }),
    },
    { id: M.number(), date: M.record() },
  ),
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
});

export const CreatorI = M.interface('creator', {
  publishKreadInfo: M.call().returns(),
  makeMintItemInvitation: M.call().returns(M.promise()),
});

export const CharacterI = M.interface('character', {
  mint: M.call().returns(M.promise()),
  equip: M.call().returns(M.promise()),
  unequip: M.call().returns(M.promise()),
  unequipAll: M.call().returns(M.promise()),
  swap: M.call().returns(M.promise()),
  validateInventoryState: M.call().returns(),
  isNameUnique: M.call(M.string()).returns(M.boolean()),
  getRandomBaseCharacter: M.call().returns(M.any()),
  makeInventoryRecorderKit: M.call(M.string()).returns(
    M.promise(M.remotable('Notifier')),
  ),
});

export const ItemI = M.interface('item', {
  mint: M.call().returns(M.promise()),
  mintDefaultBatch: M.call().returns(M.promise(M.string())),
});

export const MarketI = M.interface('market', {
  sellItem: M.call().returns(M.promise()),
  buyItem: M.call().returns(M.promise()),
  sellCharacter: M.call().returns(M.promise()),
  buyCharacter: M.call().returns(M.promise()),
  freeTokens: M.call().returns(M.promise()),
});
