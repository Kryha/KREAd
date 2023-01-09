import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";

import { text } from "../../assets";
import { ButtonText, FormText, Input, Label, LoadingPage, PrimaryButton } from "../../components";
import { ButtonInfo } from "../../components/button-info";
import { MAX_CHARACTER_LENGTH } from "../../constants";
import { color } from "../../design";
import { CharacterCreation, CharacterInMarket } from "../../interfaces";
import { useMyCharacter, useSellCharacter } from "../../service";
import {
  ArrowUp,
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

interface CharacterInformationProps {
  disabled: boolean;
}

export const CharacterInformation: FC<CharacterInformationProps> = ({ disabled }) => {
  const { id } = useParams<"id">();

  const idString = String(id);
  const [isError, setIsError] = useState(false);
  const [data, isLoading] = useMyCharacter(idString);
  const sellCharacter = useSellCharacter(idString);

  const onSubmit = async (price: number) => {
    const res = await sellCharacter.callback(price);
    if (res) {
      console.info("Sell offer sent, redirecting to shop");
      console.log({ sellCharacter });
    } else {
      console.warn("There was a problem sending the sell offer to the wallet. Please try again later.");
      setIsError(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<{ price: number }>({ mode: "onChange", reValidateMode: "onChange" });

  return (
    <ContentWrapper>
      <form onSubmit={handleSubmit((data) => onSubmit(data.price))}>
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
          <PrimaryButton type="submit" disabled={!isValid || isLoading}>
            <ButtonText customColor={color.white}>{text.store.placeInShop}</ButtonText>
            {isLoading ? <LoadingPage /> : <ArrowUp />}
          </PrimaryButton>
        </ButtonContainer>
      </form>
    </ContentWrapper>
  );
};
