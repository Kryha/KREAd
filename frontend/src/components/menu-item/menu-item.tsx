import { FC, useState } from "react";

import { CharacterItems, isString } from "../../interfaces";
import { ButtonContainer, Dash, Divider, ImageContainer, Info, InfoContainer, InfoWrapper, SubTitleContainer, TitleContainer } from "./styles";
import { Badge, ButtonText, ImageProps, Label, MenuItemName, PrimaryButton } from "../atoms";
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
  // TODO: find equpped items + categories
  const isEquipped =  false;

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
            <Label customColor={color.black}>{text.param.itemId(data.id)}</Label>
          </TitleContainer>
          <SubTitleContainer>
            <Badge>
              <ButtonText customColor={color.darkGrey}>{data.category}</ButtonText>
            </Badge>
            <Divider />
            <ButtonText>{text.param.level(data.level)}</ButtonText>
            {isEquipped && (
              <>
                <Dash />
                <ButtonText customColor={color.darkGrey}>{text.general.equipped}</ButtonText>
              </>
            )}
          </SubTitleContainer>
        </InfoContainer>
        <ButtonContainer>
          <PrimaryButton>
            <ButtonText customColor={color.white}>{text.character.unequip}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
