import { FC, useState } from "react";

import { CharacterItems, isString } from "../../interfaces";
import { ButtonContainer, Divider, EquippedLabel, ImageContainer, Info, InfoContainer, InfoWrapper } from "./styles";
import { ButtonText, ImageProps, Label, MenuItemName, PrimaryButton } from "../atoms";
import { text } from "../../assets/text";
import { color } from "../../design";
import { BaseCharacter } from "../base-character";
import { ItemThumbnail } from "../item-thumbnail";

interface Data {
  image: string | CharacterItems;
  name: string;
  level: number;
  category: string;
  id: string;
}

interface MenuItemProps {
  data: Data;
  onClick?: (id: string) => void;
  imageProps?: ImageProps;
}

export const MenuItem: FC<MenuItemProps> = ({ data, imageProps, onClick }) => {
  const [selected, setSelected] = useState(false);

  return (
    <Info
      tabIndex={0}
      selected={selected}
      onClick={() => {
        onClick && onClick(data.id);
        setSelected(true);
      }}
      onBlur={() => setSelected(false)}
    >
      {isString(data.image) ? (
        <ItemThumbnail {...imageProps} category={data.category} src={data.image} />
      ) : (
        <ImageContainer>
          <BaseCharacter items={data.image} size="mini" />
        </ImageContainer>
      )}
      <InfoWrapper>
        <InfoContainer>
          <MenuItemName>{data.name}</MenuItemName>
          <Label>{text.param.id(data.id)}</Label>
        </InfoContainer>
        {/* TODO: actually track if equipped or not */}
        <EquippedLabel>{text.general.equipped}</EquippedLabel>
        <ButtonContainer>
          <PrimaryButton>
            <ButtonText customColor={color.white}>{text.character.unequip}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
