import { FC, useState } from "react";

import {
  ImageCard,
  Info,
  InfoContainer,
  InfoWrapper,
  ButtonContainer,
  Divider,
  EquippedLabel,
  Line,
  SelectedContainer
} from "./styles";
import { BoldLabel, ButtonText, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
import { text } from "../../assets/text";
import { BaseCharacter } from "../base-character";
import { color } from "../../design";
import { Character } from "../../interfaces";

interface CharacterItemProps {
  character: Character;
  onClick: (values: Character) => void;
  id: string;
}

export const CharacterItem: FC<CharacterItemProps> = ({ character, onClick, id }) => {
  const [selected, setSelected] = useState(false);
  const isCharacterEquipped = character.characterId === id;

  return (
    <Info
      selected={selected}
      onClick={() => {
        onClick(character);
        setSelected(!selected);
      }}
    >
      <ImageCard>
        <BaseCharacter character={character} isZoomed={false} size="mini" />
      </ImageCard>
      <InfoWrapper>
        <InfoContainer>
          <MenuItemName>{character.name}</MenuItemName>
          <SelectedContainer>
            <BoldLabel customColor={color.black}>{text.param.level(character.level)}</BoldLabel>
            {Boolean(isCharacterEquipped) && (
              <>
                <Line />
                <BoldLabel>{text.character.selected}</BoldLabel>
              </>
            )}
          </SelectedContainer>
        </InfoContainer>
        <EquippedLabel customColor={color.black}>{text.param.itemId(character.characterId)}</EquippedLabel>
        <ButtonContainer>
          <Divider />
          {isCharacterEquipped ?
            (<PrimaryButton>
              <ButtonText customColor={color.white}>{text.character.select}</ButtonText>
            </PrimaryButton> )
            :
            (
              <SecondaryButton>
                <ButtonText>{text.character.selected}</ButtonText>
              </SecondaryButton>
            )}
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
