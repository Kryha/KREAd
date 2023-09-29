import { FC } from "react";
import { ButtonText, MenuText, PrimaryButton } from "../../components";
import { ElephiaCitizen, text } from "../../assets";
import { routes } from "../../navigation";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "../buy/styles";
import { color } from "../../design";
import { ButtonContainer, Container, Content, ImageContainer, MainIcon } from "./styles";

export const MobileNotAvailable: FC = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate(routes.root);
  };

  return (
    <Container>
      <ImageContainer>
        <MainIcon src={ElephiaCitizen} alt={text.character.defaultCharacter} />
      </ImageContainer>
      <Content>
        <MenuText>{text.general.desktopOnly}</MenuText>
        <ButtonContainer>
          <PrimaryButton onClick={handleButtonClick}>
            <ButtonText customColor={color.white}>{text.general.moreAboutThisProject}</ButtonText>
            <ArrowUp />
          </PrimaryButton>
        </ButtonContainer>
      </Content>
    </Container>
  );
};
