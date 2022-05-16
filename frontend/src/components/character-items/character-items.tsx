
import { FC } from "react";

import { CharacterItems as Items } from "../../interfaces";
import { text } from "../../assets";
import { imageSize, margins } from "../../design";
import { LeftEquippedItemCard, RightEquippedItemCard } from "../equipped-item-card";

import { LeftItemContainer, RightItemContainer, Row, RightItems } from "./styles";

interface CharacterItemsProps {
  items: Items;
};

// TODO: update component with item slots
export const CharacterItems: FC<CharacterItemsProps> = ({ items }) => {
  return (
    <>
      <LeftItemContainer>
        <LeftEquippedItemCard item={items.hair} code={text.products.hair} marginTop={margins.big} height={imageSize.mediumLarge} />
        <Row>
          <LeftEquippedItemCard item={items.headPiece} code={text.products.headPiece} width={imageSize.large} height={imageSize.large} marginLeft={`-${margins.extraLarge}`} />
          <LeftEquippedItemCard item={items.clothing} code={text.products.clothing} width={imageSize.medium} height={imageSize.mediumLarge} marginTop={`-${margins.big}`} />
        </Row>
        <Row>
          <LeftEquippedItemCard item={items.midBackground} code={text.products.midBackground} />
          <LeftEquippedItemCard item={items.background} code={text.products.background} />
        </Row>
      </LeftItemContainer>
      <RightItemContainer>
        <RightItems>
          <RightEquippedItemCard item={items.mask} code={text.products.mask} width={imageSize.extralarge} height={imageSize.large} marginTop={`-${imageSize.mediumLarge}`} marginLeft={`-${imageSize.medium}`} />
        </RightItems>
        <Row>
          <RightEquippedItemCard item={items.noseline} code={text.products.noseline} width={imageSize.large} height={imageSize.gigantic} marginTop={`-${imageSize.mediumLarge}`} marginLeft={`-${margins.extraLarge}`} />
          <RightEquippedItemCard item={items.airResevoir} code={text.products.airResevoir} width={imageSize.mediumLarge} height={imageSize.big} marginTop={`-${margins.extraLarge}`} marginLeft={`-${margins.small}`} />
        </Row>
        <Row>
          <RightEquippedItemCard item={items.liquid} code={text.products.liquid} width={imageSize.extraExtraLarge} height={imageSize.extraExtraLarge} marginTop={`-${imageSize.big}`} marginLeft={`-${margins.gigantic}`} />
          <RightEquippedItemCard item={items.frontMask} code={text.products.frontMask} width={imageSize.extraExtraLarge} height={imageSize.extraExtraLarge} marginTop={`-${imageSize.big}`} marginLeft={`-${margins.gigantic}`} />
        </Row>
      </RightItemContainer>
    </>
  );
};
