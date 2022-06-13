import { FC, useState } from "react";

import { CharacterItems } from "../../interfaces";
import { ButtonContainer, Divider, EquippedLabel, ImageCard, ImageContainer, Info, InfoContainer, InfoWrapper, ItemImage } from "./styles";
import { ButtonText, ImageProps, Label, MenuItemName, PrimaryButton } from "../atoms";
import { text } from "../../assets/text";
import { color } from "../../design";
import { BaseCharacter } from "../base-character";

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
      {typeof data.image === "string" ? (
        <ImageCard>
          <ItemImage
            src={data.image}
            category={data.category}
            width={imageProps?.width}
            height={imageProps?.height}
            marginTop={imageProps?.marginTop}
            marginLeft={imageProps?.marginLeft}
          />
        </ImageCard>
      ) : (
        <ImageContainer>
          <BaseCharacter items={data.image} size="mini" />
        </ImageContainer>
      )}
      <InfoWrapper>
        <InfoContainer>
          <MenuItemName>{data.name}</MenuItemName>
          <Label>{text.param.itemId(data.id)}</Label>
        </InfoContainer>
        {/* TODO: actually track if equipped or not */}
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
