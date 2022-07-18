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
        <LeftEquippedItemCard item={items.hair} code={text.itemSlots.hair} category={text.itemSlots.hair} area="top" />
        <Row>
          <LeftEquippedItemCard area="middle" item={items.headPiece} code={text.itemSlots.headPiece} category={text.itemSlots.headPiece} />
          <LeftEquippedItemCard area="middle" item={items.clothing} code={text.itemSlots.clothing} category={text.itemSlots.clothing} />
        </Row>
        <Row>
          <LeftEquippedItemCard
            area="bottom"
            item={items.background}
            code={text.itemSlots.background}
            category={text.itemSlots.background}
          />
          <LeftEquippedItemCard
            area="bottom"
            item={items.midBackground}
            code={text.itemSlots.midBackground}
            category={text.itemSlots.midBackground}
          />
        </Row>
      </LeftItemContainer>
      <RightItemContainer showItems={showItems}>
        <RightItems>
          <RightEquippedItemCard area="top" item={items.mask} code={text.itemSlots.mask} category={text.itemSlots.mask} />
        </RightItems>
        <Row>
          <RightEquippedItemCard area="middle" item={items.noseline} code={text.itemSlots.noseline} category={text.itemSlots.noseline} />
          <RightEquippedItemCard
            area="middle"
            item={items.airResevoir}
            code={text.itemSlots.airResevoir}
            category={text.itemSlots.airResevoir}
          />
        </Row>
        <Row>
          <RightEquippedItemCard area="bottom" item={items.liquid} code={text.itemSlots.liquid} category={text.itemSlots.liquid} />
          <RightEquippedItemCard area="bottom" item={items.frontMask} code={text.itemSlots.frontMask} category={text.itemSlots.frontMask} />
        </Row>
      </RightItemContainer>
    </>
  );
};
