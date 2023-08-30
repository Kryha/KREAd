import { ASSET_TYPE, SECTION } from "../../constants";

export interface AssetData {
  id: string;
  image: string;
  name: string;
  category: string;
  level: number;
  rarity?: number;
  isEquipped?: boolean;
  isForSale?: boolean;
  price?: bigint;
}

type Asset = any; // @todo fix this type

export const assetTransformer = {
  [ASSET_TYPE.CHARACTER]: {
    [SECTION.INVENTORY]: (asset: Asset): AssetData => ({
      id: asset.id,
      image: asset.image,
      name: asset.name,
      category: asset.type,
      level: asset.level,
      isEquipped: asset.isEquipped,
      isForSale: asset.isForSale,
    }),
    [SECTION.SHOP]: (asset: Asset): AssetData => ({
      id: asset.id,
      image: asset.character.image,
      name: asset.character.name,
      category: asset.character.type,
      level: asset.character.level,
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
