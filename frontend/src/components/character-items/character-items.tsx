
import { FC } from "react";

import { CharacterItems as Items } from "../../interfaces";
import { text } from "../../assets";
import { imageSize, margins } from "../../design";
import { LeftEquippedItemCard, RightEquippedItemCard } from "../equipped-item-card";

import { LeftItemContainer, RightItemContainer, Row, RightItems } from "./styles";

interface CharacterItemsProps {
  items: Items;
  showItems?: boolean;
}

// TODO: update component with item slots
export const CharacterItems: FC<CharacterItemsProps> = ({ items, showItems = true }) => {
  return (
    <>
      <LeftItemContainer showItems={showItems}>
        <LeftEquippedItemCard
          item={items.hair}
          code={text.itemSlots.hair}
          marginTop={margins.big}
          height={imageSize.mediumLarge}
          category={text.itemSlots.hair}
          area="top"
        />
        <Row>
          <LeftEquippedItemCard
            area="middle"
            item={items.headPiece}
            code={text.itemSlots.headPiece}
            width={imageSize.large}
            height={imageSize.large}
            marginLeft={`-${margins.extraLarge}`}
            category={text.itemSlots.headPiece}
          />
          <LeftEquippedItemCard
            area="middle"
            item={items.clothing}
            code={text.itemSlots.clothing}
            width={imageSize.medium}
            height={imageSize.mediumLarge}
            marginTop={`-${margins.big}`}
            category={text.itemSlots.clothing}
          />
        </Row>
        <Row>
          <LeftEquippedItemCard
            area="bottom"
            item={items.midBackground}
            code={text.itemSlots.background2}
            category={text.itemSlots.background2}
          />
          <LeftEquippedItemCard
            area="bottom"
            item={items.background}
            code={text.itemSlots.background}
            category={text.itemSlots.background}
          />
        </Row>
      </LeftItemContainer>
      <RightItemContainer showItems={showItems}>
        <RightItems>
          <RightEquippedItemCard
            area="top"
            item={items.mask}
            code={text.itemSlots.mask}
            width={imageSize.extralarge}
            height={imageSize.large}
            marginTop={`-${imageSize.mediumLarge}`}
            marginLeft={`-${imageSize.medium}`}
            category={text.itemSlots.mask}
          />
        </RightItems>
        <Row>
          <RightEquippedItemCard
            area="middle"
            item={items.noseline}
            code={text.itemSlots.noseline}
            width={imageSize.large}
            height={imageSize.gigantic}
            marginTop={`-${imageSize.mediumLarge}`}
            marginLeft={`-${margins.extraLarge}`}
            category={text.itemSlots.noseline}
          />
          <RightEquippedItemCard
            area="middle"
            item={items.airResevoir}
            code={text.itemSlots.airResevoir}
            width={imageSize.mediumLarge}
            height={imageSize.big}
            marginTop={`-${margins.extraLarge}`}
            marginLeft={`-${margins.small}`}
            category={text.itemSlots.airResevoir}
          />
        </Row>
        <Row>
          <RightEquippedItemCard
            area="bottom"
            item={items.liquid}
            code={text.itemSlots.liquid}
            width={imageSize.extraExtraLarge}
            height={imageSize.extraExtraLarge}
            marginTop={`-${imageSize.big}`}
            marginLeft={`-${margins.gigantic}`}
            category={text.itemSlots.liquid}
          />
          <RightEquippedItemCard
            area="bottom"
            item={items.frontMask}
            code={text.itemSlots.frontMask}
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
