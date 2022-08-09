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
        <LeftEquippedItemCard item={items.hair} code={text.itemSlots.hair} category="hair" area="top" />
        <Row>
          <LeftEquippedItemCard area="middle" item={items.headPiece} code={text.itemSlots.headPiece} category="headPiece" />
          <LeftEquippedItemCard area="middle" item={items.clothing} code={text.itemSlots.clothing} category="clothing" />
        </Row>
        <Row>
          <LeftEquippedItemCard area="bottom" item={items.background} code={text.itemSlots.background} category="background" />
          <LeftEquippedItemCard area="bottom" item={items.midBackground} code={text.itemSlots.midBackground} category="midBackground" />
        </Row>
      </LeftItemContainer>
      <RightItemContainer showItems={showItems}>
        <RightItems>
          <RightEquippedItemCard area="top" item={items.mask} code={text.itemSlots.mask} category="mask" />
        </RightItems>
        <Row>
          <RightEquippedItemCard area="middle" item={items.noseline} code={text.itemSlots.noseline} category="noseline" />
          <RightEquippedItemCard area="middle" item={items.airReservoir} code={text.itemSlots.airReservoir} category="airReservoir" />
        </Row>
        <Row>
          <RightEquippedItemCard area="bottom" item={items.liquid} code={text.itemSlots.liquid} category="liquid" />
          <RightEquippedItemCard area="bottom" item={items.frontMask} code={text.itemSlots.frontMask} category="frontMask" />
        </Row>
      </RightItemContainer>
    </>
  );
};
