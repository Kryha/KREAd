import { FC } from "react";
import { useForm } from "react-hook-form";

import { text } from "../../assets";
import { ButtonText, FormText, Input, Label, PrimaryButton } from "../../components";
import { ButtonInfo } from "../../components/button-info";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import {
  ButtonContainer,
  ContentWrapper,
  ErrorContainer,
  FormFields,
  InputContainer,
  InputWrapper,
  TextLabel,
  Tick,
  Warning,
} from "./styles";
import { SellData } from "./types";

interface InformationProps {
  setData: (price: number) => void;
}

export const Information: FC<InformationProps> = ({ setData }) => {
  const { width, height } = useViewport();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<SellData>({ mode: "onChange", reValidateMode: "onChange" });

  return (
    <ContentWrapper width={width} height={height}>
      <form onSubmit={handleSubmit((fields) => setData(fields.price))}>
        <FormFields>
          <InputContainer>
            <Label>{text.store.setPrice}</Label>
            <TextLabel>
              {/*TODO: remove support for e notation, or handle conversion to bigint */}
              <Input type="number" defaultValue="" {...register("price", { required: true, min: 1 })} />
            </TextLabel>
          </InputContainer>
          <InputWrapper>
            {Boolean(!errors.price && dirtyFields.price) && <Tick />}
            <ButtonInfo info={text.general.sellAssetInfo} />
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
        <FormText>{text.store.sellDescription}</FormText>
        <ButtonContainer>
          <PrimaryButton type="submit" disabled={!isValid}>
            <ButtonText customColor={color.white}>{text.general.next}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </form>
    </ContentWrapper>
  );
};
