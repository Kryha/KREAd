import { FC } from 'react';
import { Item } from "../../interfaces";

import { ButtonContainer, Divider, EquippedLabel, FilledInventoryItem, ImageCard, Info, InfoContainer, InfoWrapper, InventoryItem, MenuItemWrapper } from "./styles";
import { ImageProps, Img, Label, MenuItemName, PrimaryButton } from "../atoms";
import { text } from "../../assets/text";
import { CharacterItemFilledIcon, CharacterItemIcon } from "../../assets";
interface MenuItemProps extends ImageProps {
  items: Item[];
};

export const MenuItem: FC<MenuItemProps> = ({ items, width, height, marginTop, marginLeft }) => {

  return (
    <MenuItemWrapper>
      {items.map((item) => (
        <>
          <Info selected={false}>
            <InventoryItem src={CharacterItemIcon} />
            <FilledInventoryItem src={CharacterItemFilledIcon} />
            <ImageCard>
              <Img src={item.image} width={width} height={height} marginTop={marginTop} marginLeft={marginLeft} />
            </ImageCard>
            <InfoWrapper>
              <InfoContainer>
                <MenuItemName>{item.name}</MenuItemName>
                <Label>{text.param.itemId(item.id)}</Label>
              </InfoContainer>
              <EquippedLabel>{text.general.equipped}</EquippedLabel>
              <ButtonContainer>
                <Divider />
                <PrimaryButton>{text.character.unequip}</PrimaryButton>
              </ButtonContainer>
            </InfoWrapper>
          </Info>
        </>
      ))}
    </MenuItemWrapper>
  );
}
