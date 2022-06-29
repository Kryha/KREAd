import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { text } from "../../assets";
import { ButtonText, FormText, Input, Label, PrimaryButton } from "../../components";
import { ButtonInfo } from "../../components/button-info";
import { color } from "../../design";
import { CharacterCreation } from "../../interfaces";
import { ArrowUp, ButtonContainer, ContentWrapper, Exclamation, FormFields, InputWrapper, Tick } from "./styles";

interface InformationProps {
  submitForm: (data: CharacterCreation) => void;
  disabled: boolean;
}


export const Information: FC<InformationProps> = ({ submitForm, disabled }) => {
  const { register, handleSubmit, formState: { errors, isValid, dirtyFields } } = useForm<CharacterCreation>( { mode: "onChange",
    reValidateMode: "onChange"});
  const onSubmit: SubmitHandler<CharacterCreation> = data => submitForm(data);

  return (
    <ContentWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFields>
          <Label>{text.mint.characterName}</Label>
          <Input type="text" {...register("name", { required: true })}/>
          <InputWrapper>
            {Boolean(errors.name) && (<Exclamation />)}
            {Boolean(!errors.name && dirtyFields.name) &&  (<Tick />)}
            <ButtonInfo title={text.general.toolTipTitle} info={text.general.toolTipInfo} />
          </InputWrapper>
          {errors.name && <ButtonText customColor={color.darkGrey}>{text.general.thisFieldIsRequired}</ButtonText>}
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
