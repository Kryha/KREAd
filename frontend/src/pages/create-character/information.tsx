import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { text } from "../../assets";
import { ButtonText, FormText, Input, Label, PrimaryButton } from "../../components";
import { ButtonInfo } from "../../components/button-info";
import { MAX_CHARACTER_LENGTH } from "../../constants";
import { color } from "../../design";
import { CharacterCreation } from "../../interfaces";
import { ArrowUp, ButtonContainer, ContentWrapper, ErrorContainer, FormFields, InputWrapper, Tick, Warning } from "./styles";

interface InformationProps {
  setData: (data: CharacterCreation) => void;
  disabled: boolean;
}

export const Information: FC<InformationProps> = ({ setData, disabled }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<CharacterCreation>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<CharacterCreation> = (data) => setData(data);

  return (
    <ContentWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFields>
          <Label>{text.mint.characterName}</Label>
          <Input type="text" {...register("name", { required: true, maxLength: MAX_CHARACTER_LENGTH })} />
          <InputWrapper>
            {Boolean(!errors.name && dirtyFields.name) && <Tick />}
            <ButtonInfo info={text.general.createACharacterInfo} />
          </InputWrapper>
          {errors.name && errors.name.type === "required" && (
            <ErrorContainer>
              <Warning />
              <ButtonText>{text.general.thisFieldIsRequired}</ButtonText>
            </ErrorContainer>
          )}
          {errors.name && errors.name.type === "maxLength" && (
            <ErrorContainer>
              <Warning />
              <ButtonText>{text.general.maxCharacterLength}</ButtonText>
            </ErrorContainer>
          )}
        </FormFields>
        <FormText>{text.mint.theCostsOfMinting}</FormText>
        <ButtonContainer>
          <PrimaryButton type="submit" disabled={!isValid || disabled}>
            <ButtonText customColor={color.white}>{text.mint.next}</ButtonText>
            <ArrowUp />
          </PrimaryButton>
        </ButtonContainer>
      </form>
    </ContentWrapper>
  );
};
