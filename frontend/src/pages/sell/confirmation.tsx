import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonText, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, Tick, TickContainer } from "./styles";
import { SellText } from "./types";

interface Props {
  text: SellText;
}

export const Confirmation: FC<Props> = ({ text }) => {
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
        <PrimaryButton onClick={() => navigate(routes.inventory)}>
          <ButtonText customColor={color.white}>{text.check}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
