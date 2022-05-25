import { FC, useState } from "react";

import {
  ImageCard,
  Info,
  InfoContainer,
  InfoWrapper,
  CharacterItemWrapper,
  ElemantImage,
  InventoryItem,
  FilledInventoryItem,
  ButtonContainer,
  Divider,
  EquippedLabel
} from "./styles";
import { ButtonText, Label, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
import { text } from "../../assets/text";
import { BaseCharacter } from "../base-character";
import { CharacterItemFilledIcon, CharacterItemIcon, SmallEl } from "../../assets";
import { color } from "../../design";
import { Character } from "../../interfaces";

interface CharacterItemProps {
  character: Character;
  onClick: (values: Character) => void;
  id: string;
}

export const CharacterItem: FC<CharacterItemProps> = ({ character, onClick, id }) => {
  const [select, setSelected] = useState(false);
  const isCharacterEquipped = character.characterId === id;

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
              <Label customColor={color.black}>{text.param.itemId(character.characterId)}</Label>
            </InfoContainer>
            {Boolean(isCharacterEquipped) && (
              <EquippedLabel>{text.general.equipped}</EquippedLabel>
            )}
            <ButtonContainer>
              <Divider />
              {isCharacterEquipped ? <PrimaryButton><ButtonText customColor={color.white}>{text.character.unequip}</ButtonText></PrimaryButton> : <SecondaryButton><ButtonText>{text.character.equip}</ButtonText></SecondaryButton>}
            </ButtonContainer>
          </InfoWrapper>
        </Info>
      </>
    </CharacterItemWrapper>
  );
};
