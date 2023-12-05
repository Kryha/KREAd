import { Category, Item } from "../../interfaces";
import { Badge, BoldLabel, ButtonText, ImageProps, LevelBoldLabel, PrimaryButton } from "../atoms";
import React, { FC } from "react";
import {
  AssetContent,
  AssetEquippedContainer,
  AssetFooter,
  AssetImage,
  AssetImageContainer,
  AssetInfoContainer,
  AssetStatsContainer,
  AssetSubTitle,
  AssetTag,
  AssetTitleText,
  AssetTitleWrapper,
  AssetWrapper,
  Equipped,
} from "./styles";
import { EquippedIcon, text } from "../../assets";
import { color } from "../../design";
import { getRarityString, useEquipItem, useUnequipItem } from "../../service";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorView } from "../error-view";
import { routes } from "../../navigation";
import { useCharacterBuilder } from "../../context/character-builder-context";

interface Props {
  item: Item;
  selectItem: (name: string, category: Category, characterName: string | undefined) => void;
  imageProps?: ImageProps;
}
export const ItemCardInventory: FC<Props> = ({ item, selectItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowToast } = useCharacterBuilder();

  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;
  const equipAsset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(true);
    equipItem.mutate({ item, callback: {} });
  };

  const unequipAsset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(true);
    unequipItem.mutate({ item, callback: {} });
  };

  const sellAsset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`${routes.sellItem}/${item.category}/${item.name}`, { state: location });
  };

  const handleClick = () => {
    selectItem(item.name, item.category, item.equippedTo);
  };

  return (
    <AssetWrapper onClick={() => handleClick()}>
      <AssetContent>
        <AssetImageContainer>
          {item.equippedTo && (
            <AssetEquippedContainer>
              <Equipped />
            </AssetEquippedContainer>
          )}
          <AssetImage src={item.thumbnail} category={item.category} />
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{item.name}</AssetTitleText>
            <AssetSubTitle>
              <BoldLabel>{item.category}</BoldLabel>
              {item.equippedTo && (
                <AssetSubTitle>
                  <Equipped>
                    <EquippedIcon />
                  </Equipped>
                  <BoldLabel preserveCase>{item.equippedTo}</BoldLabel>
                </AssetSubTitle>
              )}
            </AssetSubTitle>
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
            {item.equippedTo ? (
              <PrimaryButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => unequipAsset(event)}>
                <ButtonText customColor={color.white}>unequip</ButtonText>
              </PrimaryButton>
            ) : (
              <>
                <PrimaryButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => equipAsset(event)}>
                  <ButtonText customColor={color.white}>equip</ButtonText>
                </PrimaryButton>
                <PrimaryButton onClick={(event) => sellAsset(event)}>
                  <ButtonText customColor={color.white}>{text.general.sell}</ButtonText>
                </PrimaryButton>
              </>
            )}
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};
