import { FC, SyntheticEvent, useState } from "react";

import {
  ImageCard,
  ButtonContainer,
  EquippedLabel,
  Line,
  InfoContainer,
  SubTitleContainer,
  Info,
  InfoWrapper,
  TitleContainer,
} from "./styles";
import { ButtonText, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
import { text } from "../../assets/text";
import { BaseCharacter } from "../base-character";
import { color } from "../../design";
import { Character } from "../../interfaces";

interface CharacterItemProps {
  character: Character;
  onClick: (character: Character) => void;
  onButtonClick: (character: Character) => void;
  id: string;
  removeInitial?: () => void;
  isInitial?: boolean;
}

export const CharacterItem: FC<CharacterItemProps> = ({ character, onClick, onButtonClick, id, isInitial = false, removeInitial }) => {
  const [selected, setSelected] = useState(false);
  const isCharacterEquipped = character.id === id;

  const handleButtonClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onButtonClick(character);
  };

  return (
    <Info
      tabIndex={0}
      selected={selected || isInitial}
      onClick={() => {
        onClick && onClick(character);
        setSelected(true);
        removeInitial && removeInitial();
      }}
      onBlur={() => setSelected(false)}
    >
      <ImageCard>
        <BaseCharacter characterImage={character.image} items={character.items} isZoomed={false} size="mini" />
      </ImageCard>
      <InfoWrapper>
        <InfoContainer>
          <TitleContainer>
            <MenuItemName>{character.name}</MenuItemName>
            {isCharacterEquipped && <EquippedLabel customColor={color.black}>{text.character.selected}</EquippedLabel>}
          </TitleContainer>
          <SubTitleContainer>
            <ButtonText customColor={color.darkGrey}>{character.type}</ButtonText>
            <Line />
            <ButtonText>{text.param.level(character.level)}</ButtonText>
          </SubTitleContainer>
        </InfoContainer>
        <ButtonContainer>
          {isCharacterEquipped ? (
            <PrimaryButton>
              <ButtonText customColor={color.white}>{text.character.selected}</ButtonText>
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={handleButtonClick}>
              <ButtonText>{text.character.select}</ButtonText>
            </SecondaryButton>
          )}
        </ButtonContainer>
      </InfoWrapper>
    </Info>
  );
};
