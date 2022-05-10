import { CharacterItems as Items } from "@agoric/types";
import { FC } from "react";
import { text } from "../../assets";
import { imageSize, margins } from "../../design";
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
        <LeftEquippedItemCard item={findEquipped(items.hair)} code={text.products.hair} marginTop={margins.big} height={imageSize.mediumLarge} />
        <Row>
          <LeftEquippedItemCard item={findEquipped(items.headPiece)} code={text.products.headPiece} width={imageSize.large} height={imageSize.large} marginLeft={`-${margins.extraLarge}`} />
          <LeftEquippedItemCard item={findEquipped(items.clothing)} code={text.products.clothing} width={imageSize.medium} height={imageSize.mediumLarge} marginTop={`-${margins.big}`} />
        </Row>
        <Row>
          <LeftEquippedItemCard item={findEquipped(items.midBackground)} code={text.products.midBackground} />
          <LeftEquippedItemCard item={findEquipped(items.background)} code={text.products.background} />
        </Row>
      </LeftItemContainer>
      <RightItemContainer>
        <RightItems>
          <RightEquippedItemCard item={findEquipped(items.mask)} code={text.products.mask} width={imageSize.extralarge} height={imageSize.large} marginTop={`-160px`} marginLeft={"-104px"} />
        </RightItems>
        <Row>
          <RightEquippedItemCard item={findEquipped(items.noseline)} code={text.products.noseline} width={imageSize.large} height={imageSize.gigantic} marginTop={`-130px`} marginLeft={`-${margins.extraLarge}`} />
          <RightEquippedItemCard item={findEquipped(items.airResevoir)} code={text.products.airResevoir} width={imageSize.mediumLarge} height={imageSize.large} marginTop={`-90px`} marginLeft={`-${margins.small}`} />
        </Row>
        <Row>
          <RightEquippedItemCard item={findEquipped(items.liquid)} code={text.products.liquid} width={imageSize.extraExtraLarge} height={imageSize.extraExtraLarge} marginTop={`-200px`} marginLeft={`-120px`} />
          <RightEquippedItemCard item={findEquipped(items.frontMask)} code={text.products.frontMask} width={imageSize.extraExtraLarge} height={imageSize.extraExtraLarge} marginTop={`-200px`} marginLeft={`-120px`} />
        </Row>
      </RightItemContainer>
    </>
  );
};
