import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonText, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { routes } from "../../navigation";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, Tick, TickContainer } from "./styles";
import { BuyText } from "./types";

interface Props {
  text: BuyText;
}

export const Confirmation: FC<Props> = ({ text }) => {
  const navigate = useNavigate();

  return (
    <ContentWrapper>
      <TickContainer>
        <Tick />
      </TickContainer>
      <TitleText>{text.success}</TitleText>
      <InfoContainer>
        <FormText>{text.successLong}</FormText>
      </InfoContainer>
      <ButtonContainer>
        <PrimaryButton onClick={() => navigate(routes.inventory)}>
          <ButtonText customColor={color.white}>{text.check}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
