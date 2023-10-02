import React, { FC, useMemo } from "react";
import { ButtonText, ItemCard, LoadingPage } from "../../../components";
import { useGetItemsInInventory, useSelectedCharacter } from "../../../service";
import { useIsMobile, useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { CategoryCard, CategoryCardsContainer, CategoryCardsWrapper, CategoryImage, CategoryInfo, CategoryInfoCategory } from "./style";
import { CATEGORY, ITEM_MODE } from "../../../constants";
import { ItemCount } from "../../../components/equipped-item-card/styles";
import { breakpoints } from "../../../design";

export type ItemCategoryCounts = {
  [key: string]: number;
};

export const CategoryCards: FC = () => {
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const items = useMemo(() => selectedCharacter?.equippedItems || {}, [selectedCharacter]);
  const { selectedAssetCategory, setSelectedAssetCategory, setInteractionMode } = useCharacterBuilder();
  const itemKeys = Object.keys(CATEGORY) as (keyof typeof CATEGORY)[];
  const [availableItems] = useGetItemsInInventory();
  const isMobile = useIsMobile(breakpoints.tablet);

  const unequippedAvailableItems = availableItems.filter((item) => item.equippedTo === "");
  const itemCategoryCounts: ItemCategoryCounts = unequippedAvailableItems.reduce((countObj: ItemCategoryCounts, item) => {
    const { category } = item;
    countObj[category] = (countObj[category] || 0) + 1;
    return countObj;
  }, {});

  const { height, width } = useViewport();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!selectedCharacter?.equippedItems) {
    // Handle the case when selectedCharacter is null (e.g., no character selected)
    return <></>;
  }

  return (
    <CategoryCardsWrapper height={height} width={width}>
      <CategoryCardsContainer>
        {itemKeys.map((itemKey) => {
          // Ensure itemKey is never undefined
          if (!itemKey) return null;

          return (
            <CategoryCard
              key={itemKey}
              isSelected={selectedAssetCategory === itemKey}
              onClick={() => {
                setSelectedAssetCategory(itemKey);
                setInteractionMode(ITEM_MODE);
              }}
            >
              <CategoryImage>
                {itemCategoryCounts[itemKey] !== undefined ? (
                  <ItemCount>
                    <ButtonText>{itemCategoryCounts[itemKey]}</ButtonText>
                  </ItemCount>
                ) : null}
                <ItemCard key={itemKey} item={items[itemKey]} image={items[itemKey]?.thumbnail} />
              </CategoryImage>
              <CategoryInfo>
                <CategoryInfoCategory>{itemKey}</CategoryInfoCategory>
                {!isMobile && <CategoryInfoCategory>{itemCategoryCounts[itemKey] || 0} available in inventory</CategoryInfoCategory>}
              </CategoryInfo>
            </CategoryCard>
          );
        })}
      </CategoryCardsContainer>
    </CategoryCardsWrapper>
  );
};
