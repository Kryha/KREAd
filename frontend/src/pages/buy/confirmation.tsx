import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonText, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, Tick, TickContainer } from "./styles";
import { BuyText } from "./types";
import { useViewport } from "../../hooks";

interface Props {
  text: BuyText;
  link: string;
}

export const Confirmation: FC<Props> = ({ text, link }) => {
  const navigate = useNavigate();
  const { width, height } = useViewport();

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
        <PrimaryButton onClick={() => navigate(link)}>
          <ButtonText customColor={color.white}>{text.check}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
