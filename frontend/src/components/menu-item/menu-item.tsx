import { FC, useState } from "react";

import { CharacterItems, isString } from "../../interfaces";
import { ButtonContainer, Dash, EquippedLabel, ImageContainer, Info, InfoContainer, InfoWrapper, InlineDetails, TitleContainer } from "./styles";
import { Badge, BoldLabel, ButtonText, ImageProps, Label, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
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
  // TODO: find if item is equipped
  const isEquipped = false;
  const isForSale = false;

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
          <TitleContainer>
            <MenuItemName>{data.name}</MenuItemName>
          </TitleContainer>
          <InlineDetails>
            <ButtonText customColor={color.darkGrey}>{data.category}</ButtonText>
            <Dash />
            <BoldLabel customColor={color.black}>{text.param.level(data.level)}</BoldLabel>
            {isEquipped && (
              <>
                <Dash />
                <ButtonText customColor={color.darkGrey}>{text.general.equipped}</ButtonText>
              </>
            )}
            {isForSale && (
              <>
                <Dash />
                <ButtonText customColor={color.darkGrey}>{text.general.forSale}</ButtonText>
              </>
            )}
          </InlineDetails>
        </InfoContainer>
        <ButtonContainer>
          {isEquipped ? (
            <SecondaryButton>
              <ButtonText customColor={color.white}>{text.character.unequip}</ButtonText>
            </SecondaryButton>
          ) : (
            <PrimaryButton>
              <ButtonText customColor={color.white}>{text.character.equip}</ButtonText>
            </PrimaryButton>
          )}
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
