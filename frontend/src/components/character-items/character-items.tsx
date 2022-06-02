
import { FC } from "react";

import { CharacterItems as Items } from "../../interfaces";
import { text } from "../../assets";
import { imageSize, margins } from "../../design";
import { LeftEquippedItemCard, RightEquippedItemCard } from "../equipped-item-card";

import { LeftItemContainer, RightItemContainer, Row, RightItems } from "./styles";

interface CharacterItemsProps {
  items: Items;
}

// TODO: update component with item slots
export const CharacterItems: FC<CharacterItemsProps> = ({ items }) => {
  return (
    <>
      <LeftItemContainer>
        <LeftEquippedItemCard
          item={items.hair}
          code={text.products.hairCode}
          marginTop={margins.big}
          height={imageSize.mediumLarge}
          category={text.products.hair}
        />
        <Row>
          <LeftEquippedItemCard
            item={items.headPiece}
            code={text.products.headPieceCode}
            width={imageSize.large}
            height={imageSize.large}
            marginLeft={`-${margins.extraLarge}`}
            category={text.products.headPiece}
          />
          <LeftEquippedItemCard
            item={items.clothing}
            code={text.products.clothingCode}
            width={imageSize.medium}
            height={imageSize.mediumLarge}
            marginTop={`-${margins.big}`}
            category={text.products.clothing}
          />
        </Row>
        <Row>
          <LeftEquippedItemCard
            item={items.midBackground}
            code={text.products.midBackgroundCode}
            category={text.products.midBackground}
          />
          <LeftEquippedItemCard
            item={items.background}
            code={text.products.backgroundCode}
            category={text.products.background}
          />
        </Row>
      </LeftItemContainer>
      <RightItemContainer>
        <RightItems>
          <RightEquippedItemCard
            item={items.mask}
            code={text.products.maskCode}
            width={imageSize.extralarge}
            height={imageSize.large}
            marginTop={`-${imageSize.mediumLarge}`}
            marginLeft={`-${imageSize.medium}`}
            category={text.products.mask}
          />
        </RightItems>
        <Row>
          <RightEquippedItemCard
            item={items.noseline}
            code={text.products.noselineCode}
            width={imageSize.large}
            height={imageSize.gigantic}
            marginTop={`-${imageSize.mediumLarge}`}
            marginLeft={`-${margins.extraLarge}`}
            category={text.products.noseline}
          />
          <RightEquippedItemCard
            item={items.airResevoir}
            code={text.products.airResevoirCode}
            width={imageSize.mediumLarge}
            height={imageSize.big}
            marginTop={`-${margins.extraLarge}`}
            marginLeft={`-${margins.small}`}
            category={text.products.airResevoir}
          />
        </Row>
        <Row>
          <RightEquippedItemCard
            item={items.liquid}
            code={text.products.liquidCode}
            width={imageSize.extraExtraLarge}
            height={imageSize.extraExtraLarge}
            marginTop={`-${imageSize.big}`}
            marginLeft={`-${margins.gigantic}`}
            category={text.products.liquid}
          />
          <RightEquippedItemCard
            item={items.frontMask}
            code={text.products.frontMaskCode}
            width={imageSize.extraExtraLarge}
            height={imageSize.extraExtraLarge}
            marginTop={`-${imageSize.big}`}
            marginLeft={`-${margins.gigantic}`}
            category={text.products.frontMask}
          />
        </Row>
      </RightItemContainer>
    </>
  );
};
