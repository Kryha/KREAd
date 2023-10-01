import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonText, FormTable, FormTableRow, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { ArrowUp, ButtonContainer, InfoContainer, Tick, TickContainer } from "./styles";
import { BuyData, BuyText } from "./types";
import { ConfirmationContainer } from "../sell/confirmation";
import { Header } from "../sell/styles";

interface Props {
  text: BuyText;
  link: string;
  data: BuyData;
}

export const Confirmation: FC<Props> = ({ text, link, data }) => {
  const navigate = useNavigate();

  return (
    <ConfirmationContainer>
      <Header>
        <TickContainer>
          <Tick />
        </TickContainer>
        <TitleText>{text.success}</TitleText>
      </Header>
      <FormTable>
        <FormTableRow>
          <FormText>asset type</FormText>
          <ButtonText>{data.type}</ButtonText>
        </FormTableRow>
        <FormTableRow>
          <FormText>name</FormText>
          <ButtonText>{data.name}</ButtonText>
        </FormTableRow>
      </FormTable>
      <InfoContainer>
        <FormText>{text.successLong}</FormText>
      </InfoContainer>
      <ButtonContainer>
        <PrimaryButton onClick={() => navigate(link)}>
          <ButtonText customColor={color.white}>{text.check}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ConfirmationContainer>
  );
};
