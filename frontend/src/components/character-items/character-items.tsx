
import { FC } from "react";

import { CharacterItems as Items } from "../../interfaces";
import { text } from "../../assets";
import { LeftEquippedItemCard, RightEquippedItemCard } from "../equipped-item-card";

import { LeftItemContainer, RightItemContainer, Row, RightItems } from "./styles";

interface CharacterItemsProps {
  items: Items;
  showItems?: boolean;
}

export const CharacterItems: FC<CharacterItemsProps> = ({ items, showItems = true }) => {
  return (
    <>
      <LeftItemContainer showItems={showItems}>
        <LeftEquippedItemCard
          item={items.hair}
          code={text.itemSlots.hair}
          category={text.itemSlots.hair}
          area="top"
        />
        <Row>
          <LeftEquippedItemCard
            area="middle"
            item={items.headPiece}
            code={text.itemSlots.headPiece}
            category={text.itemSlots.headPiece}
          />
          <LeftEquippedItemCard
            area="middle"
            item={items.clothing}
            code={text.itemSlots.clothing}
            category={text.itemSlots.clothing}
          />
        </Row>
        <Row>
          <LeftEquippedItemCard
            area="bottom"
            item={items.background1}
            code={text.itemSlots.background}
            category={text.itemSlots.background}
          />
          <LeftEquippedItemCard
            area="bottom"
            item={items.background2}
            code={text.itemSlots.background2}
            category={text.itemSlots.background2}
          />
        </Row>
      </LeftItemContainer>
      <RightItemContainer showItems={showItems}>
        <RightItems>
          <RightEquippedItemCard
            area="top"
            item={items.mask}
            code={text.itemSlots.mask}
            category={text.itemSlots.mask}
          />
        </RightItems>
        <Row>
          <RightEquippedItemCard
            area="middle"
            item={items.styleline}
            code={text.itemSlots.styleline}
            category={text.itemSlots.styleline}
          />
          <RightEquippedItemCard
            area="middle"
            item={items.filter1}
            code={text.itemSlots.filter}
            category={text.itemSlots.filter}
          />
        </Row>
        <Row>
          <RightEquippedItemCard
            area="bottom"
            item={items.filter2}
            code={text.itemSlots.filter2}
            category={text.itemSlots.filter2}
          />
          <RightEquippedItemCard
            area="bottom"
            item={items.addOns}
            code={text.itemSlots.addOns}
            category={text.itemSlots.addOns}
          />
        </Row>
      </RightItemContainer>
    </>
  );
};
