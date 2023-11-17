import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonText, FormTable, FormTableRow, FormText, PrimaryButton, TitleText } from "../../components";
import { color } from "../../design";
import { ArrowUp, AssetName, ButtonContainer, Header, InfoContainer, Tick, TickContainer, ConfirmationContainer } from "./styles";
import { SellData, SellText } from "./types";

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
          <AssetName>{data.name}</AssetName>
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

