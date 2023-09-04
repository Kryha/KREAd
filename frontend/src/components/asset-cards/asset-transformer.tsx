import { ASSET_TYPE, SECTION } from "../../constants";
import { Character, CharacterEquip, CharacterInMarket, CharacterItems, Detail } from "../../interfaces";

export interface AssetData {
  id: string;
  image: string;
  name: string;
  category: string;
  level: number;
  rarity?: number;
  equippedItems?: CharacterItems;
  detail?: Detail;
  isEquipped?: boolean;
  isForSale?: boolean;
  price?: bigint;
}

type Asset = any; // @todo fix this type

export const assetTransformer = {
  [ASSET_TYPE.CHARACTER]: {
    [SECTION.INVENTORY]: (asset: CharacterEquip): AssetData => ({
      id: asset.nft.id,
      image: asset.nft.image,
      name: asset.nft.name,
      category: asset.nft.type,
      level: asset.nft.level,
      isEquipped: asset.isEquipped,
      isForSale: asset.isForSale,
    }),
    [SECTION.SHOP]: (asset: CharacterInMarket): AssetData => ({
      id: asset.id,
      image: asset.character.image,
      name: asset.character.name,
      category: asset.character.type,
      level: asset.character.level,
      equippedItems: asset.equippedItems,
      detail: asset.character.detail,
      price: asset.sell.price,
    }),
  },
  [ASSET_TYPE.ITEM]: {
    [SECTION.INVENTORY]: (asset: Asset): AssetData => ({
      id: asset.id,
      image: asset.thumbnail,
      name: asset.name,
      category: asset.category,
      level: asset.level,
      rarity: asset.rarity,
      isEquipped: asset.isEquipped,
      isForSale: asset.isForSale,
    }),
    [SECTION.SHOP]: (asset: Asset): AssetData => ({
      id: asset.id,
      image: asset.item.thumbnail,
      name: asset.item.name,
      category: asset.item.category,
      level: asset.item.level,
      rarity: asset.item.rarity,
      price: asset.sell.price,
    }),
  },
};
