import { FC, useState } from "react";

import {
  ImageCard,
  ButtonContainer,
  EquippedLabel,
  Line,
  InfoContainer,
  SubTitleContainer,
  TitleContainer,
  Info,
  InfoWrapper,
  Divider
} from "./styles";
import { Badge, BoldLabel, ButtonText, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
import { text } from "../../assets/text";
import { BaseCharacter } from "../base-character";
import { color } from "../../design";
import { Character } from "../../interfaces";

interface CharacterItemProps {
  character: Character;
  onClick?: (character: Character) => void;
  id: string;
}

export const CharacterItem: FC<CharacterItemProps> = ({ character, onClick, id }) => {
  const [selected, setSelected] = useState(false);
  const isCharacterEquipped = character.characterId === id;

  return (
    <Info
      tabIndex={0}
      selected={selected}
      onClick={() => {
        onClick && onClick(character);
        setSelected(true);
      }}
      onBlur={() => setSelected(false)}
    >
      <ImageCard>
        <BaseCharacter items={character.items} isZoomed={false} size="mini" />
      </ImageCard>
      <InfoWrapper>
        <InfoContainer>
          <TitleContainer>
            <MenuItemName>{character.name}</MenuItemName>
            <EquippedLabel customColor={color.black}>{text.param.id(character.characterId)}</EquippedLabel>
          </TitleContainer>
          <SubTitleContainer>
            <Badge>
              <ButtonText customColor={color.darkGrey}>{character.type}</ButtonText>
            </Badge>
            <ButtonText>{text.param.level(character.level)}</ButtonText>
            {isCharacterEquipped && (
              <>
                <Line />
                <BoldLabel>{text.character.selected}</BoldLabel>
              </>
            )}
          </SubTitleContainer>
        </InfoContainer>
        <ButtonContainer>
          {isCharacterEquipped ? (
            <PrimaryButton>
              <ButtonText customColor={color.white}>{text.character.selected}</ButtonText>
            </PrimaryButton>
          ) : (
            <SecondaryButton>
              <ButtonText>{text.character.select}</ButtonText>
            </SecondaryButton>
          )}
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
