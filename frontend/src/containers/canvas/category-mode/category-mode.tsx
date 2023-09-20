import React, { FC } from "react";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { CATEGORY_MODE } from "../../../constants";
import { CanvasAssetContainer, CanvasAssetHeader, CanvasAssetInventoryWrapper } from "../style";
import { CategoryCards } from "../category-cards/category-cards";
import { ModeScroller } from "../mode-scroller/mode-scroller";

export const CategoryMode: FC = () => {
  const { setInteractionMode } = useCharacterBuilder();

  setInteractionMode(CATEGORY_MODE);

  return (
    <CanvasAssetInventoryWrapper>
      <CanvasAssetContainer>
        <CanvasAssetHeader>
          <ModeScroller />
        </CanvasAssetHeader>
        <CategoryCards />
      </CanvasAssetContainer>
    </CanvasAssetInventoryWrapper>
  );
};
