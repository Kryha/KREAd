import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonText, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, Tick, TickContainer } from "./styles";
import { SellText } from "./types";

interface Props {
  text: SellText;
  confirmationPath: string;
}

export const Confirmation: FC<Props> = ({ text, confirmationPath }) => {
  const { width, height } = useViewport();
  const navigate = useNavigate();

  return (
    <ContentWrapper width={width} height={height}>
      <TickContainer>
        <Tick />
      </TickContainer>
      <TitleText>{text.success}</TitleText>
      <InfoContainer>
        <FormText>{text.successLong}</FormText>
      </InfoContainer>
      <ButtonContainer>
        <PrimaryButton onClick={() => navigate(confirmationPath)}>
          <ButtonText customColor={color.white}>{text.check}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
