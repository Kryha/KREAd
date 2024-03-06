import { FC } from "react";
import { text } from "../../assets";
import { ButtonText, ErrorView, MenuItemName, TitleText } from "../../components";
import { color } from "../../design";
import { Character } from "../../interfaces";
import { getDatefromEpoch } from "../../util";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, PrimaryButtonMobile, Tick, TickContainer } from "./styles";
import { useUserStateDispatch } from "../../context/user";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

interface ConfirmationProps {
  character?: Character;
}

export const Confirmation: FC<ConfirmationProps> = ({ character }) => {
  const userStateDispatch = useUserStateDispatch();
  const navigate = useNavigate();

  if (!character) {
    console.error("No character found");
    return <ErrorView />;
  }

  const handleConfirm = () => {
    userStateDispatch({ type: "SET_SELECTED", payload: character.name });
    navigate(routes.character);
  };

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
        <MenuItemName preserveCase>{character.name}</MenuItemName>
        <ButtonText customColor={color.darkGrey}>{text.mint.creationDate}</ButtonText>
        <MenuItemName>{getDatefromEpoch(Date.now())}</MenuItemName>
      </InfoContainer>
      <ButtonContainer>
        <PrimaryButtonMobile onClick={handleConfirm} mobileWidth="100px">
          <ButtonText customColor={color.white}>{text.mint.goToCharacter}</ButtonText>
          <ArrowUp />
        </PrimaryButtonMobile>
      </ButtonContainer>
    </ContentWrapper>
  );
};
