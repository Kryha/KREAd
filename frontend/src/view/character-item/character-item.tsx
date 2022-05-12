
import { FC, useState } from 'react';
import { Character } from "@agoric/types";

import { ImageCard, Info, InfoContainer, InfoWrapper, CharacterItemWrapper, ElemantImage, InventoryItem, FilledInventoryItem, ButtonContainer, Divider, EquippedLabel } from "./styles";
import { Label, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
import { text } from "../../assets/text";
import { BaseCharacter } from "../base-character";
import { CharacterItemFilledIcon, CharacterItemIcon, SmallEl } from "../../assets";
import { color } from "../../design";

interface CharacterItemProps {
  character: Character;
  onClick: (values: Character) => void;
};

export const CharacterItem: FC<CharacterItemProps> = ({ character, onClick }) => {
  const [select, setSelected] = useState(false);
  return (
    <CharacterItemWrapper onClick={() => { onClick(character); setSelected(!select); }}>
      <>
        <Info selected={select}>
          <InventoryItem src={CharacterItemIcon} />
          <FilledInventoryItem src={CharacterItemFilledIcon} />
          <ImageCard>
            <ElemantImage src={SmallEl} />
            <BaseCharacter character={character} isZoomed={false} size="mini" />
          </ImageCard>
          <InfoWrapper>
            <InfoContainer>
              <MenuItemName>{character.name}</MenuItemName>
              <Label customColor={color.black}>{text.param.itemId(character.id)}</Label>
            </InfoContainer>
            {Boolean(character.equipped) && (
              <EquippedLabel>{text.general.equipped}</EquippedLabel>
            )}
            <ButtonContainer>
              <Divider />
              {character.equipped ? <PrimaryButton>{"Equip"}</PrimaryButton> : <SecondaryButton>{"Unequip"}</SecondaryButton>}
            </ButtonContainer>
          </InfoWrapper>
        </Info>
      </>
    </CharacterItemWrapper>
  );
}
