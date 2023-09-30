import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonText, FormTable, FormTableRow, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { ArrowUp, ButtonContainer, Header, InfoContainer, Tick, TickContainer } from "./styles";
import { SellData, SellText } from "./types";
import styled from "@emotion/styled";

interface Props {
  text: SellText;
  confirmationPath: string;
  data: SellData;
}

export const Confirmation: FC<Props> = ({ text, confirmationPath, data }) => {
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
        <PrimaryButton onClick={() => navigate(confirmationPath)}>
          <ButtonText customColor={color.white}>{text.check}</ButtonText>
          <ArrowUp />
        </PrimaryButton>
      </ButtonContainer>
    </ConfirmationContainer>
  );
};

export const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
