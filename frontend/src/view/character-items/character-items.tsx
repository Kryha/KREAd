import { CharacterItems as Items } from "@agoric/types";
import { FC } from "react";
import { text } from "../../assets";
import { findEquipped } from "../../util";
import { LeftEquippedItemCard, RightEquippedItemCard } from "../equipped-item-card";

import { LeftItemContainer, RightItemContainer, Row, RightItems } from "./styles";

interface CharacterItemsProps {
  items: Items;
};

export const CharacterItems: FC<CharacterItemsProps> = ({ items }) => {
  return (
    <>
      <LeftItemContainer>
        <LeftEquippedItemCard item={findEquipped(items.hair)} code={text.products.hair} />
        <Row>
          <LeftEquippedItemCard item={findEquipped(items.headPiece)} code={text.products.headPiece} />
          <LeftEquippedItemCard item={findEquipped(items.clothing)} code={text.products.clothing} />
        </Row>
        <Row>
          <LeftEquippedItemCard item={findEquipped(items.midBackground)} code={text.products.midBackground} />
          <LeftEquippedItemCard item={findEquipped(items.background)} code={text.products.background} />
        </Row>
      </LeftItemContainer>
      <RightItemContainer>

        <RightEquippedItemCard item={findEquipped(items.mask)} code={text.products.mask} />
        <Row>
          <RightEquippedItemCard item={findEquipped(items.noseline)} code={text.products.noseline} />
          <RightEquippedItemCard item={findEquipped(items.airResevoir)} code={text.products.airResevoir} />
        </Row>
        <Row>
          <RightEquippedItemCard item={findEquipped(items.liquid)} code={text.products.liquid} />
          <RightEquippedItemCard item={findEquipped(items.frontMask)} code={text.products.frontMask} />
        </Row>

      </RightItemContainer>
    </>
  );
};
