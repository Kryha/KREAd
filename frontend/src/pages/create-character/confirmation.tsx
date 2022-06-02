import { FC } from "react";
import { Navigate } from "react-router-dom";
import { text } from "../../assets";

import { ButtonText, ErrorView, MenuItemName, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { Character } from "../../interfaces";
import { routes } from "../../navigation";
import { useEquipCharacter } from "../../service";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, Tick, TickContainer, } from "./styles";

interface ConfirmationProps {
  character?: Character;
}

export const Confirmation: FC<ConfirmationProps> = ({ character }) => {
  const equipCharacter = useEquipCharacter();

  if (!character) return <ErrorView />;

  const equipNewCharacter = () => {
    equipCharacter.mutate({ id: character.characterId });
  };

  // TODO: add noticifaction
  if (equipCharacter.isSuccess) return <Navigate to={routes.root} />;

  if (equipCharacter.isError) return <ErrorView />;

  return (
    <ContentWrapper>
      <TickContainer>
        <Tick />
      </TickContainer>
      <TitleText>{text.mint.characterSuccessfullyMinted}</TitleText>
      <InfoContainer>
        <ButtonText customColor={color.darkGrey}>{text.mint.characterTitle}</ButtonText>
        <MenuItemName>{character.title}</MenuItemName>
        <ButtonText customColor={color.darkGrey}>{text.mint.characterName}</ButtonText>
        <MenuItemName>{character.name}</MenuItemName>
        <ButtonText customColor={color.darkGrey}>{text.mint.creationDate}</ButtonText>
        <MenuItemName>{character.itemActivity.date}</MenuItemName>
      </InfoContainer>
      <ButtonContainer>
        <PrimaryButton onClick={() => equipNewCharacter()}>
          <ButtonText customColor={color.white}>{text.mint.goToCharacter}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
