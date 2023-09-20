import React, { FC, useMemo } from "react";
import { ItemCard, LoadingPage } from "../../../components";
import { useSelectedCharacter } from "../../../service";
import { useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { CategoryCard, CategoryCardsContainer, CategoryCardsWrapper, CategoryInfo, CategoryInfoCategory } from "./style";
import { CATEGORY, ITEM_MODE } from "../../../constants";

export const CategoryCards: FC = () => {
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const items = useMemo(() => selectedCharacter?.equippedItems || {}, [selectedCharacter]);
  const { selectedAssetCategory, setSelectedAssetCategory, setInteractionMode } = useCharacterBuilder();
  const itemKeys = Object.keys(CATEGORY) as (keyof typeof CATEGORY)[];

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
        {itemKeys.map((itemKey) => (
          <CategoryCard
            key={itemKey}
            isSelected={selectedAssetCategory === itemKey}
            onClick={() => {
              setSelectedAssetCategory(itemKey);
              setInteractionMode(ITEM_MODE);
            }}
          >
            <ItemCard key={itemKey} item={items[itemKey]} image={items[itemKey]?.thumbnail} />
            <CategoryInfo>
              <CategoryInfoCategory>{itemKey}</CategoryInfoCategory>
            </CategoryInfo>
          </CategoryCard>
        ))}
      </CategoryCardsContainer>
    </CategoryCardsWrapper>
  );
};
