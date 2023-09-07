import React, { FC, useEffect, useState } from "react";
import { DefaultIcon, text } from "../../assets";
import { ErrorView, FormHeader, LoadingPage } from "../../components";
import { PageContainer } from "../../components/page-container";
import { MINT_CHARACTER_FLOW_STEPS, WALLET_INTERACTION_STEP } from "../../constants";
import { useIsMobile, useViewport } from "../../hooks";
import { CharacterCreation, ExtendedCharacter } from "../../interfaces";
import { routes } from "../../navigation";
import { useCreateCharacter, useMyCharacters } from "../../service";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { Payment } from "./payment";
import { DefaultImage, FormCard } from "./styles";
import { breakpoints } from "../../design";

export const CreateCharacter: FC = () => {
  const createCharacter = useCreateCharacter();
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [mintedCharacter, setMintedCharacter] = useState<ExtendedCharacter>();
  const [characterData, setCharacterData] = useState<CharacterCreation>({ name: "" });
  const [myCharacters, isLoadingCharacters] = useMyCharacters();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState<boolean>(false);
  const mobile = useIsMobile(breakpoints.tablet);

  // TODO: Implement wallet listener for cases where the user doesn't approve the mint
  // const [isWalletError, setIsWalletError] = useState<boolean>(false);

  useEffect(() => {
    if (myCharacters.map((c) => c.nft.name).includes(characterData.name)) {
      setIsOfferAccepted(true);
      const [newCharacter] = myCharacters.filter((character) => character.nft.name === characterData.name);
      setMintedCharacter(newCharacter);
      setIsLoading(false);
    }
  }, [myCharacters, characterData]);

  const changeStep = async (step: number): Promise<void> => {
    setCurrentStep(step);
  };

  const sendOfferHandler = async (): Promise<void> => {
    setIsLoading(true);
    await createCharacter.mutateAsync({ name: characterData.name });
  };

  const setData = async (data: CharacterCreation): Promise<void> => {
    setCharacterData(data);
    setCurrentStep(WALLET_INTERACTION_STEP);
  };

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return <Information setData={setData} disabled={createCharacter.isLoading} />;
      case 1:
        return <Payment sendOfferHandler={sendOfferHandler} submit={changeStep} isOfferAccepted={isOfferAccepted} isLoading={isLoading} />;
      case 2:
        return <Confirmation character={mintedCharacter?.nft} />;
      default:
        return <ErrorView />;
    }
  };

  if (isLoadingCharacters) return <LoadingPage spinner={false} />;

  return (
    <PageContainer
      sidebarContent={
        <FormCard height={height} width={width}>
          <FormHeader
            currentStep={currentStep}
            stepAmount={MINT_CHARACTER_FLOW_STEPS}
            title={text.mint.mintNew}
            link={routes.character}
            isPaymentFlow
          />
          {perStepDisplay()}
        </FormCard>
      }
    >
      {!mobile && <DefaultImage src={DefaultIcon} alt={text.character.defaultCharacter} height={height} width={width} />}
    </PageContainer>
  );
};
