import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonText, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, Tick, TickContainer } from "./styles";
import { SellData, SellText } from "./types";

interface Props {
  data: SellData;
  text: SellText;
}

export const Confirmation: FC<Props> = ({ data, text }) => {
  const { width, height } = useViewport();
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(`${data.object === "character" ? routes.buyCharacter : routes.buyItem}/${data.id}`);
  };

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
        <PrimaryButton onClick={onClickHandler}>
          <ButtonText customColor={color.white}>{text.check}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
