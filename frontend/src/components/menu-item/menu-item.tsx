import { FC, useState } from "react";

import { CharacterItems, isString } from "../../interfaces";
import { ButtonContainer, Dash, ImageContainer, Info, InfoContainer, InfoWrapper, InlineDetails, TitleContainer } from "./styles";
import { BoldLabel, ButtonText, ImageProps, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
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
}

interface MenuItemProps {
  data: Data;
  onClick?: (id: string) => void;
  onButtonClick?: () => void;
  isEquipped?: boolean;
  isForSale?: boolean;
  imageProps?: ImageProps;
  isInitial?: boolean;
  removeInitial?: () => void;
}

export const MenuItem: FC<MenuItemProps> = ({
  data,
  imageProps,
  onClick,
  onButtonClick,
  isInitial = false,
  removeInitial,
  isEquipped,
  isForSale,
}) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    onClick && onClick(data.id);
    removeInitial && removeInitial();
    setSelected(true);
  };

  return (
    <Info tabIndex={0} selected={selected || isInitial} onClick={handleClick} onBlur={() => setSelected(false)}>
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

        {!!onButtonClick && (
          <ButtonContainer>
            {isEquipped ? (
              <SecondaryButton onClick={() => onButtonClick()}>
                <ButtonText customColor={color.white}>{text.character.unequip}</ButtonText>
              </SecondaryButton>
            ) : (
              <PrimaryButton onClick={() => onButtonClick()}>
                <ButtonText customColor={color.white}>{text.character.equip}</ButtonText>
              </PrimaryButton>
            )}
          </ButtonContainer>
        )}
      </InfoWrapper>
    </Info>
  );
};
