import { FC, useMemo, useState } from "react";
import { ASSETS_PER_PAGE, ASSET_TYPE, SECTION } from "../../constants";
import { AssetCardLoadMore } from "../asset-card-load-more/asset-card-load-more";
import { AssetsContainer, AssetsWrapper } from "./styles";
import { useViewport } from "../../hooks";
import { LoadingPage } from "../content-loader";
import { AssetCard } from "../asset-card";
import { Item, ItemCategory } from "../../interfaces";
import { ItemCardInventory } from "../asset-card/item-card-inventory";

export interface AssetData {
  id: string;
  image: string;
  name: string;
  category: string;
  level: number;
  rarity: number;
  isEquipped?: boolean;
  isForSale?: boolean;
  price?: bigint;
}

interface Props {
  items: Item[];
  isLoading: boolean;
  selectItem: (name: string, category: ItemCategory) => void;
  selectedItem: { name: string, category?: ItemCategory };
};

export const ItemCardsInventory: FC<Props> = ({ items, isLoading, selectItem, selectedItem }) => {
  const { height } = useViewport();
  const [visibleAssets, setVisibleAssets] = useState<number>(ASSETS_PER_PAGE);
  const loadMoreAssets = () => {
    setVisibleAssets((prevVisibleAssets) => prevVisibleAssets + ASSETS_PER_PAGE);
  };
  
  if (isLoading) return <LoadingPage spinner={false} />;
  return (
    <AssetsWrapper height={height}>
      {items.length > 0 && (
        <AssetsContainer>
          {items.slice(0, visibleAssets).map((item, index) => (
            <ItemCardInventory
              key={index}
              item={item}
              selectItem={() => selectItem(item.name, item.category)}
            />
          ))}
          {visibleAssets <items.length && <AssetCardLoadMore isLoading={isLoading} loadMore={loadMoreAssets} />}
        </AssetsContainer>
      )}
    </AssetsWrapper>
  );
};
