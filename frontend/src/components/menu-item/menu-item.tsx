import { FC } from "react";
import { Item } from "../../interfaces";

import {
  ButtonContainer,
  Divider,
  EquippedLabel,
  FilledInventoryItem,
  ImageCard,
  Info,
  InfoContainer,
  InfoWrapper,
  InventoryItem,
  ItemImage,
} from "./styles";
import { ButtonText, ImageProps, Label, MenuItemName, PrimaryButton } from "../atoms";
import { text } from "../../assets/text";
import { CharacterItemFilledIcon, CharacterItemIcon } from "../../assets";
import { color } from "../../design";
interface MenuItemProps extends ImageProps {
  item: Item;
}

export const MenuItem: FC<MenuItemProps> = ({ item, width, height, marginTop, marginLeft }) => {
  return (
    <Info selected={false}>
      <InventoryItem src={CharacterItemIcon} />
      <FilledInventoryItem src={CharacterItemFilledIcon} />
      {/* TODO: use slots */}
      <ImageCard>
        <ItemImage src={item.image} width={width} height={height} marginTop={marginTop} marginLeft={marginLeft} category={item.category} />
      </ImageCard>
      <InfoWrapper>
        <InfoContainer>
          <MenuItemName>{item.name}</MenuItemName>
          <Label>{text.param.itemId(item.id)}</Label>
        </InfoContainer>
        <EquippedLabel>{text.general.equipped}</EquippedLabel>
        <ButtonContainer>
          <Divider />
          <PrimaryButton>
            <ButtonText customColor={color.white}>{text.character.unequip}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
