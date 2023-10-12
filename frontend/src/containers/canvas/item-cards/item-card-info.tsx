// TODO: Add the conditions for swapping items if the item is equipped to the character

import React, { FC } from "react";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { ItemButtonContainer, ItemInfo, ItemInfoItem, ItemsRow } from "./style";
import { Item } from "../../../interfaces";
import { Badge, BoldLabel, ButtonText, LevelBoldLabel, SecondaryButton } from "../../../components";
import { color } from "../../../design";
import { getRarityString } from "../../../service";
import { ButtonInfoWrap } from "../../../components/button-info/styles";
import { text } from "../../../assets";
import { AssetTag } from "../../../components/asset-card/styles";

interface ItemInfoProps {
  item: Item;
  info?: boolean;
}
export const ItemCardInfo: FC<ItemInfoProps> = ({ item, info = true }) => {
  const { showItemDetails, setShowItemDetails } = useCharacterBuilder();

  const showDetails = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowItemDetails(!showItemDetails);
  };

  return (
    <ItemInfo>
      <ButtonText customColor={color.black}>{item?.name}</ButtonText>
      <ItemInfoItem>Origin: {item?.origin}</ItemInfoItem>
      <ItemsRow>
        <AssetTag>
          <BoldLabel>lvl. </BoldLabel>
          <LevelBoldLabel>{item.level}</LevelBoldLabel>
        </AssetTag>
        <Badge>
          <ButtonText>{getRarityString(item?.rarity)}</ButtonText>
        </Badge>
      </ItemsRow>
      <ItemButtonContainer>
        {info && (
          <ButtonInfoWrap>
            <SecondaryButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => showDetails(event)}>
              {text.general.info}
            </SecondaryButton>
          </ButtonInfoWrap>
        )}
      </ItemButtonContainer>
    </ItemInfo>
  );
};
