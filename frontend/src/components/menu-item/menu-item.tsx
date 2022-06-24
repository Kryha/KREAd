import { FC, useState } from "react";

import { CharacterItems, isString } from "../../interfaces";
import { ButtonContainer, Divider, EquippedLabel, ImageContainer, Info, InfoContainer, InfoWrapper, InlineDetails } from "./styles";
import { Badge, ButtonText, ImageProps, Label, MenuItemName, PrimaryButton } from "../atoms";
import { text } from "../../assets/text";
import { color } from "../../design";
import { BaseCharacter } from "../base-character";
import { ItemThumbnail } from "../item-thumbnail";

export interface Data {
  image: string | CharacterItems;
  name: string;
  level: number;
  category: string;
  id: string;
  equipped?: boolean;
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
          <InlineDetails>
            <Badge>
              <ButtonText customColor={color.darkGrey}>{data.category}</ButtonText>
            </Badge>
            <Divider />
            <Label>{text.param.level(data.level)}</Label>
          </InlineDetails>
        </InfoContainer>
        <EquippedLabel customColor={color.black}>{text.param.id(data.id)}</EquippedLabel>
        <ButtonContainer>
          <PrimaryButton>
            <ButtonText customColor={color.white}>{text.character.unequip}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
