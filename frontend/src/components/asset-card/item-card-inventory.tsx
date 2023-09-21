import { Category, Item } from "../../interfaces";
import { Badge, BoldLabel, ButtonText, ImageProps, LevelBoldLabel } from "../atoms";
import { FC } from "react";
import {
  AssetContent,
  AssetFooter,
  AssetImage,
  AssetImageContainer,
  AssetInfoContainer,
  AssetStatsContainer,
  AssetTag,
  AssetTitleText,
  AssetTitleWrapper,
  AssetWrapper,
} from "./styles";
import { EquippedIcon, text } from "../../assets";
import { color } from "../../design";
import { getRarityString } from "../../service";
import styled from "@emotion/styled";

interface Props {
  item: Item;
  selectItem: (name: string, category: Category, characterName: string | undefined) => void;
  imageProps?: ImageProps;
}
export const ItemCardInventory: FC<Props> = ({ item, selectItem }) => {
  const handleClick = () => {
    selectItem(item.name, item.category, item.equippedTo);
  };

  return (
    <AssetWrapper onClick={() => handleClick()}>
      <AssetContent>
        <AssetImageContainer>
          {item.equippedTo && (
            <AssetEquippedContainer>
              <EquippedIcon />
            </AssetEquippedContainer>
          )}
          <AssetImage src={item.image} category={item.category} />
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{item.name}</AssetTitleText>
            <BoldLabel>{item.category}</BoldLabel>
          </AssetTitleWrapper>
          <AssetStatsContainer>
            <AssetTag>
              <BoldLabel customColor={color.black}>lvl. </BoldLabel>
              <LevelBoldLabel customColor={color.black}>{item.level}</LevelBoldLabel>
            </AssetTag>
            <Badge>
              <ButtonText>{item.origin}</ButtonText>
            </Badge>
            <Badge>
              <ButtonText>{getRarityString(item.rarity)}</ButtonText>
            </Badge>
          </AssetStatsContainer>
          <AssetFooter>
            {item.equippedTo && <BoldLabel>equipped to: {item.equippedTo}</BoldLabel>}
            {item.forSale && <BoldLabel>{text.general.forSale}</BoldLabel>}
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};

export const AssetEquippedContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
