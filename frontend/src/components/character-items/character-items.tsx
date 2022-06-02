
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
          code={text.itemSlots.hairCode}
          marginTop={margins.big}
          height={imageSize.mediumLarge}
          category={text.itemSlots.hair}
        />
        <Row>
          <LeftEquippedItemCard
            item={items.headPiece}
            code={text.itemSlots.headPieceCode}
            width={imageSize.large}
            height={imageSize.large}
            marginLeft={`-${margins.extraLarge}`}
            category={text.itemSlots.headPiece}
          />
          <LeftEquippedItemCard
            item={items.clothing}
            code={text.itemSlots.clothingCode}
            width={imageSize.medium}
            height={imageSize.mediumLarge}
            marginTop={`-${margins.big}`}
            category={text.itemSlots.clothing}
          />
        </Row>
        <Row>
          <LeftEquippedItemCard
            item={items.midBackground}
            code={text.itemSlots.midBackgroundCode}
            category={text.itemSlots.midBackground}
          />
          <LeftEquippedItemCard
            item={items.background}
            code={text.itemSlots.backgroundCode}
            category={text.itemSlots.background}
          />
        </Row>
      </LeftItemContainer>
      <RightItemContainer>
        <RightItems>
          <RightEquippedItemCard
            item={items.mask}
            code={text.itemSlots.maskCode}
            width={imageSize.extralarge}
            height={imageSize.large}
            marginTop={`-${imageSize.mediumLarge}`}
            marginLeft={`-${imageSize.medium}`}
            category={text.itemSlots.mask}
          />
        </RightItems>
        <Row>
          <RightEquippedItemCard
            item={items.noseline}
            code={text.itemSlots.noselineCode}
            width={imageSize.large}
            height={imageSize.gigantic}
            marginTop={`-${imageSize.mediumLarge}`}
            marginLeft={`-${margins.extraLarge}`}
            category={text.itemSlots.noseline}
          />
          <RightEquippedItemCard
            item={items.airResevoir}
            code={text.itemSlots.airResevoirCode}
            width={imageSize.mediumLarge}
            height={imageSize.big}
            marginTop={`-${margins.extraLarge}`}
            marginLeft={`-${margins.small}`}
            category={text.itemSlots.airResevoir}
          />
        </Row>
        <Row>
          <RightEquippedItemCard
            item={items.liquid}
            code={text.itemSlots.liquidCode}
            width={imageSize.extraExtraLarge}
            height={imageSize.extraExtraLarge}
            marginTop={`-${imageSize.big}`}
            marginLeft={`-${margins.gigantic}`}
            category={text.itemSlots.liquid}
          />
          <RightEquippedItemCard
            item={items.frontMask}
            code={text.itemSlots.frontMaskCode}
            width={imageSize.extraExtraLarge}
            height={imageSize.extraExtraLarge}
            marginTop={`-${imageSize.big}`}
            marginLeft={`-${margins.gigantic}`}
            category={text.itemSlots.frontMask}
          />
        </Row>
      </RightItemContainer>
    </>
  );
};
