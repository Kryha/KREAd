import { CharacterItems } from "../../../interfaces";
import React, { FC } from "react";
import { LeftEquippedItemCard, RightEquippedItemCard } from "../../../components";
import { text } from "../../../assets";
import { breakpoints } from "../../../design";
import { LeftPane, RightPane } from "../character-canvas/styles";
import { CLOTHING, FILTER1, FILTER2, HAIR, HEADPIECE, ITEM_CATEGORIES, MASK, PATCH, PERK1, PERK2 } from "../../../constants";
import { useIsMobile } from "../../../hooks";
import { MainModeMobile } from "./main-mode-mobile";
import { LeftItemContainer, LeftItems, RightItemContainer, RightItems, Row } from "./styles";

interface Props {
  items: CharacterItems;
  showItems: boolean;
}
export const MainMode: FC<Props> = ({ items, showItems }) => {
  const isMobile = useIsMobile(breakpoints.tablet);

  return isMobile ? (
    <MainModeMobile />
  ) : (
    <>
      <LeftPane>
        <LeftItemContainer showItems={showItems}>
          <LeftItems>
            <LeftEquippedItemCard
              area="top"
              item={items.background}
              code={text.itemSlots.background}
              category={ITEM_CATEGORIES.background}
            />
          </LeftItems>
          <Row>
            <LeftEquippedItemCard area="middle" item={items.patch} code={text.itemSlots.patch} category={PATCH} />
            <LeftEquippedItemCard area="middle" item={items.hair} code={text.itemSlots.hair} category={HAIR} />
          </Row>
          <Row>
            <LeftEquippedItemCard area="bottom" item={items.headPiece} code={text.itemSlots.headPiece} category={HEADPIECE} />
            <LeftEquippedItemCard area="bottom" item={items.mask} code={text.itemSlots.mask} category={MASK} />
          </Row>
        </LeftItemContainer>
      </LeftPane>
      <RightPane>
        <RightItemContainer showItems={showItems}>
          <RightItems>
            <RightEquippedItemCard area="top" item={items.perk1} code={text.itemSlots.perk1} category={PERK1} />
          </RightItems>
          <Row>
            <RightEquippedItemCard area="middle" item={items.filter1} code={text.itemSlots.filter1} category={FILTER1} />
            <RightEquippedItemCard area="middle" item={items.perk2} code={text.itemSlots.perk2} category={PERK2} />
          </Row>
          <Row>
            <RightEquippedItemCard area="bottom" item={items.filter2} code={text.itemSlots.filter2} category={FILTER2} />
            <RightEquippedItemCard area="bottom" item={items.clothing} code={text.itemSlots.clothing} category={CLOTHING} />
          </Row>
        </RightItemContainer>
      </RightPane>
    </>
  );
};
