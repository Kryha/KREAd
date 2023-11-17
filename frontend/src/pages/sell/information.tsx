import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { text } from "../../assets";
import { ButtonText, FormTable, FormTableRow, FormText, Input, Label, PrimaryButton } from "../../components";
import { ButtonInfo } from "../../components/button-info";
import { color } from "../../design";
import { ButtonContainer, ErrorContainer, FormFields, InputContainer, InputWrapper, TextLabel, Tick, Warning, AssetName } from "./styles";
import { SellData } from "./types";
import { FormContainer } from "../create-character/styles";
import { SellDescription } from "../../components/sell-description/sell-description";

interface InformationProps {
  setData: (price: number) => void;
  data: SellData;
  disabled?: boolean;
}

export const Information: FC<InformationProps> = ({ setData, data }) => {
  const [price, setPrice] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<SellData>({ mode: "onChange", reValidateMode: "onChange" });

  return (
    <>
      <FormContainer onSubmit={handleSubmit((fields) => setData(fields.price))}>
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
        <FormFields>
          <Label>{text.store.setPrice}</Label>
          <InputWrapper>
            <InputContainer>
              <TextLabel>
                <Input
                  type="number"
                  defaultValue=""
                  placeholder="IST"
                  {...register("price", {
                    required: true,
                    min: 1,
                    onChange: (event) => {
                      setPrice(event.target.value);
                    },
                  })}
                />
              </TextLabel>
            </InputContainer>
            {Boolean(!errors.price && dirtyFields.price) && <Tick />}
            <ButtonInfo info={text.general.sellAssetInfo} infoPosition={"right"} />
          </InputWrapper>
          {Boolean(errors.price && errors.price.type === "required") && (
            <ErrorContainer>
              <Warning />
              <ButtonText>{text.general.thisFieldIsRequired}</ButtonText>
            </ErrorContainer>
          )}
          {Boolean(errors.price && errors.price.type === "min") && (
            <ErrorContainer>
              <Warning />
              <ButtonText>{text.general.theMinimiumAmountIs}</ButtonText>
            </ErrorContainer>
          )}
        </FormFields>
        <SellDescription price={Number(price)} />
        <ButtonContainer>
          <PrimaryButton type="submit" disabled={!isValid}>
            <ButtonText customColor={color.white}>{text.general.next}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </FormContainer>
    </>
  );
};
