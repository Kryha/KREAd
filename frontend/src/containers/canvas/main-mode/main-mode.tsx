import { CharacterItems } from "../../../interfaces";
import React, { FC } from "react";
import { LeftEquippedItemCard, RightEquippedItemCard } from "../../../components";
import { text } from "../../../assets";
import { LeftPane, RightPane } from "../character-canvas/styles";
import { LeftItemContainer, LeftItems, RightItemContainer, RightItems, Row } from "./styles";
import { CATEGORY } from "../../../constants";

interface Props {
  items: CharacterItems;
  showItems: boolean;
}
export const MainMode: FC<Props> = ({ items, showItems }) => {
  return (
    <>
      <LeftPane>
        <LeftItemContainer showItems={showItems}>
          <LeftItems>
            <LeftEquippedItemCard area="top" item={items.background} code={text.itemSlots.background} category={CATEGORY.background} />
          </LeftItems>
          <Row>
            <LeftEquippedItemCard area="middle" item={items.patch} code={text.itemSlots.patch} category={CATEGORY.patch} />
            <LeftEquippedItemCard area="middle" item={items.hair} code={text.itemSlots.hair} category={CATEGORY.hair} />
          </Row>
          <Row>
            <LeftEquippedItemCard area="bottom" item={items.headPiece} code={text.itemSlots.headPiece} category={CATEGORY.headPiece} />
            <LeftEquippedItemCard area="bottom" item={items.mask} code={text.itemSlots.mask} category={CATEGORY.mask} />
          </Row>
        </LeftItemContainer>
      </LeftPane>
      <RightPane>
        <RightItemContainer showItems={showItems}>
          <RightItems>
            <RightEquippedItemCard area="top" item={items.perk1} code={text.itemSlots.perk1} category={CATEGORY.perk1} />
          </RightItems>
          <Row>
            <RightEquippedItemCard area="middle" item={items.filter1} code={text.itemSlots.filter1} category={CATEGORY.filter1} />
            <RightEquippedItemCard area="middle" item={items.perk2} code={text.itemSlots.perk2} category={CATEGORY.perk2} />
          </Row>
          <Row>
            <RightEquippedItemCard area="bottom" item={items.filter2} code={text.itemSlots.filter2} category={CATEGORY.filter2} />
            <RightEquippedItemCard area="bottom" item={items.garment} code={text.itemSlots.garment} category={CATEGORY.garment} />
          </Row>
        </RightItemContainer>
      </RightPane>
    </>
  );
};
