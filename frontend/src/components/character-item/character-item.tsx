import { FC, SyntheticEvent, useState } from "react";

import {
  ButtonContainer,
  EquippedLabel,
  ImageCard,
  Info,
  InfoContainer,
  InfoWrapper,
  Line,
  SubTitleContainer,
  TitleContainer,
} from "./styles";
import { ButtonText, MenuItemName, PrimaryButton, SecondaryButton } from "../atoms";
import { text } from "../../assets";
import { BaseCharacter } from "../base-character";
import { color } from "../../design";
import { ExtendedCharacter, isCharacterCategory } from "../../interfaces";

interface CharacterItemProps {
  character: ExtendedCharacter;
  onClick: (character: ExtendedCharacter) => void;
  onButtonClick: (character: ExtendedCharacter) => void;
  id: string;
  removeInitial?: () => void;
  isInitial?: boolean;
}

export const CharacterItem: FC<CharacterItemProps> = ({ character, onClick, onButtonClick, id, isInitial = false, removeInitial }) => {
  const [selected, setSelected] = useState(false);
  const isCharacterEquipped = character.nft.id.toString() === id;

  const handleButtonClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onButtonClick(character);
  };

  // if (!isCharacterCategory(character.nft.type)) return <></>;

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
        <BaseCharacter characterImage={character.nft.image} items={character.equippedItems} isZoomed={false} size="mini" />
      </ImageCard>
      <InfoWrapper>
        <InfoContainer>
          <TitleContainer>
            <MenuItemName>{character.nft.name}</MenuItemName>
            {isCharacterEquipped && <EquippedLabel customColor={color.black}>{text.character.selected}</EquippedLabel>}
          </TitleContainer>
          <SubTitleContainer>
            {/* <ButtonText customColor={color.darkGrey}>{text.param.categories[character.nft]}</ButtonText> */}
            <Line />
            <ButtonText>{text.param.level(character.nft.level)}</ButtonText>
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
