import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { text } from "../../assets";

import { ButtonText, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { Item } from "../../interfaces";
import { routes } from "../../navigation";
import { ArrowUp, ButtonContainer, ContentWrapper, InfoContainer, Tick, TickContainer, } from "./styles";

interface ConfirmationProps {
  item: Item;
}

export const Confirmation: FC<ConfirmationProps> = () => {
  const navigate = useNavigate();

  return (
    <ContentWrapper>
      <TickContainer>
        <Tick />
      </TickContainer>
      <TitleText>{text.store.itemSuccessfullyBought}</TitleText>
      <InfoContainer>
        <FormText>{text.store.yourNewItemIs}</FormText>
      </InfoContainer>
      <ButtonContainer>
        <PrimaryButton onClick={() => navigate(routes.inventory)}>
          <ButtonText customColor={color.white}>{text.store.checkItem}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ContentWrapper>
  );
};
