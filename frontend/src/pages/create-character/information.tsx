import { CharacterCreation } from "../../interfaces";
import { FC, useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ArrowUp,
  ButtonContainer,
  ButtonWrapper,
  ContentWrapper,
  ErrorContainer,
  FormContainer,
  FormFields,
  InputWrapper,
  Tick,
  Warning,
} from "./styles";
import { ButtonText, FormText, Input, Label, PrimaryButton } from "../../components";
import { text } from "../../assets";
import { MAX_CHARACTER_LENGTH, MINTING_COST } from "../../constants";
import { ButtonInfo } from "../../components/button-info";
import { color } from "../../design";
import { useWalletState } from "../../context/wallet";

interface InformationProps {
  setData: (data: CharacterCreation) => void;
  disabled: boolean;
}

export const Information: FC<InformationProps> = ({ setData, disabled }) => {
  const { ist, characterNameList } = useWalletState();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields, },
  } = useForm<CharacterCreation>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const watchNameInput = watch("name", "");
  const notEnoughIST = useMemo(()=>{
    if(ist < MINTING_COST || !ist) {
      return true;
    }
    return false;
  }, [ist]);
  
  const nameTaken = useMemo(()=>{
    if(characterNameList.includes(watchNameInput)) {
      return true;
    }
    return false;
  }, [characterNameList, watchNameInput]);
  
  const onSubmit: SubmitHandler<CharacterCreation> = (data) => setData( { name: data.name } );

  return (
    <ContentWrapper>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormFields>
          <Label>{text.mint.characterName}</Label>
          <InputWrapper>
            <Input type="text" {...register("name", 
            { 
              required: true,
              maxLength: MAX_CHARACTER_LENGTH, 
              pattern: /^[a-zA-Z0-9_-]*$/,              
              })} />
            {Boolean(!errors.name && dirtyFields.name) && <Tick />}
            <ButtonInfo info={text.general.createACharacterInfo} infoPosition={"right"} />
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
          {errors.name && errors.name.type === "pattern" && (
            <ErrorContainer>
              <Warning />
              <ButtonText>{text.general.characterNamePatternError}</ButtonText>
            </ErrorContainer>
          )}
          {notEnoughIST && (
            <ErrorContainer>
              <Warning />
              <ButtonText customColor={color.red}>{text.error.mint.insufficientFunds(ist)}</ButtonText>
            </ErrorContainer>
          )}
          {nameTaken && (
            <ErrorContainer>
              <Warning />
              <ButtonText customColor={color.red}>{text.error.mint.nameTaken}</ButtonText>
            </ErrorContainer>
          )}
        </FormFields>
        <FormText>{text.mint.theCostsOfMinting}</FormText>
        <ButtonWrapper>
          <ButtonContainer>
            <PrimaryButton type="submit" disabled={!isValid || disabled || notEnoughIST}>
              <ButtonText customColor={color.white}>{text.mint.next}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </ButtonContainer>
        </ButtonWrapper>
      </FormContainer>
    </ContentWrapper>
  );
};
