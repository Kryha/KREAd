
import { FC, useCallback } from 'react';
import { Item } from "@agoric/types";

import { ButtonContainer, Divider, EquippedLabel, FilledInventoryItem, ImageCard, Info, InfoContainer, InfoWrapper, InventoryItem, MenuItemWrapper } from "./styles";
import { ImageProps, Img, Label, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
import { HorizontalDivider } from "../atoms/lines";
import { text } from "../../assets/text";
import { CharacterItemFilledIcon, CharacterItemIcon } from "../../assets";
interface MenuItemProps extends ImageProps {
  items: Item[];
};

export const MenuItem: FC<MenuItemProps> = ({ items, width, height, marginTop, marginLeft }) => {
  const moveArrayItem = useCallback(
    () => {
      const allItems = [...items];
      const fromIndex = items.findIndex((item) => item.equipped === true);
      allItems.splice(0, 0, ...allItems.splice(fromIndex, 1));
      return allItems;
    }, [items]);

  const sortedItems = moveArrayItem();
  return (
    <MenuItemWrapper>
      {sortedItems.map((item) => (
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
              {Boolean(item.equipped) && (
                <EquippedLabel>{text.general.equipped}</EquippedLabel>
              )}
              <ButtonContainer>
                <Divider />
                {item.equipped ? <PrimaryButton>{text.character.unequip}</PrimaryButton> : <SecondaryButton>{text.character.equip}</SecondaryButton>}
              </ButtonContainer>
            </InfoWrapper>
          </Info>
          {Boolean(item.equipped) && (
            <HorizontalDivider />
          )}
        </>
      ))}
    </MenuItemWrapper>
  );
}
