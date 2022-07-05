import { FC, ReactNode } from "react";
import { useForm } from "react-hook-form";

import { text } from "../../assets";
import { ButtonText, Data, FormHeaderClose, FormText, Input, Label, MenuItem, PrimaryButton } from "../../components";
import { PageContainer } from "../../components/page-container";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { FormCard } from "../create-character/styles";
import { ArrowUp, ButtonContainer, CardContainer, ContentWrapper, DetailContainer, ErrorContainer, FormFields, InputContainer, InputWrapper, TextLabel, Tick, Warning } from "./styles";
import { color } from "../../design";
import { ButtonInfo } from "../../components/button-info";
import { SellText } from "./types";

interface Props {
  children: ReactNode;
  onSubmit: (price: number) => void;
  text: SellText;
  data: Data;
}

export const Sell: FC<Props> = ({ children, onSubmit, text: pText, data }) => {
  const { width, height } = useViewport();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<{ price: number }>({ mode: "onChange", reValidateMode: "onChange" });

  return (
    <ContentWrapper width={width} height={height}>
      <FormCard height={height} width={width}>
        <FormHeaderClose title={pText.sell} link={routes.character} />
        <CardContainer>
          <MenuItem data={data} />
        </CardContainer>
        <form onSubmit={handleSubmit((data) => onSubmit(data.price))}>
          <FormFields>
            <InputContainer>
              <Label>{text.store.setPrice}</Label>
              <TextLabel>
                <Input type="number" defaultValue="" {...register("price", { required: true, min: 1 })} />
              </TextLabel>
            </InputContainer>
            <InputWrapper>
              {Boolean(!errors.price && dirtyFields.price) && <Tick />}
              <ButtonInfo title={text.general.toolTipTitle} info={text.general.toolTipInfo} />
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
              <ButtonText customColor={color.white}>{text.store.placeInShop}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </ButtonContainer>
        </form>
      </FormCard>
      <DetailContainer>{children}</DetailContainer>
    </ContentWrapper>
  );
};
