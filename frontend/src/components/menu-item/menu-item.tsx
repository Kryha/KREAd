import { FC, useState } from "react";
import { Item } from "../../interfaces";

import { ButtonContainer, Divider, EquippedLabel, ImageCard, Info, InfoContainer, InfoWrapper, ItemImage } from "./styles";
import { ButtonText, ImageProps, Label, MenuItemName, PrimaryButton } from "../atoms";
import { text } from "../../assets/text";
import { color } from "../../design";
interface MenuItemProps extends ImageProps {
  item: Item;
  onClick?: () => void;
}

// TODO: What does InventnryItem do here?
export const MenuItem: FC<MenuItemProps> = ({ item, width, height, marginTop, marginLeft, onClick }) => {
  const [selected, setSelected] = useState(false);
  return (
    <Info
      tabIndex={0}
      selected={selected}
      onClick={() => {
        onClick && onClick();
        setSelected(true);
      }}
      onBlur={() => setSelected(false)}
    >
      {/* <InventoryItem src={CharacterItemIcon} /> */}
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
