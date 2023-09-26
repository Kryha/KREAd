import React, { FC } from "react";
import { CanvasAssetContainer, CanvasAssetHeader, CanvasAssetInventoryWrapper } from "../style";
import { CategoryCards } from "../category-cards/category-cards";
import { ModeScroller } from "../mode-scroller/mode-scroller";

export const CategoryMode: FC = () => {
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
