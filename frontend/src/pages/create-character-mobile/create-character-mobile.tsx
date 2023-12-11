import React, { FC, useEffect, useMemo, useState } from "react";
import { text } from "../../assets";
import { ErrorView, FadeInOut, FormHeader, LoadingPage, NotificationDetail, Overlay } from "../../components";
import { PageContainer } from "../../components/page-container";
import { MINTING_COST, MINT_CHARACTER_FLOW_STEPS, WALLET_INTERACTION_STEP } from "../../constants";
import { Character, CharacterCreation, MakeOfferCallback } from "../../interfaces";
import { routes } from "../../navigation";
import { useCreateCharacter } from "../../service";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { Payment } from "./payment";
import { FormCard } from "./styles";
import { useUserState } from "../../context/user";
import { useWalletState } from "../../context/wallet";
import { NotificationWrapper } from "../../components/notification-detail/styles";

export const CreateCharacterMobile: FC = () => {
  const createCharacter = useCreateCharacter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [mintedCharacter, setMintedCharacter] = useState<Character>();
  const [error, setError] = useState<string>();
  const [showToast, setShowToast] = useState(false);
  const [characterData, setCharacterData] = useState<{ name: string }>({
    name: "",
  });
  const { characters, fetched } = useUserState();
  const isLoadingCharacters = !fetched;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState<boolean>(false);
  const { ist } = useWalletState();

  const notEnoughIST = useMemo(() => {
    if (ist < MINTING_COST || !ist) {
      return true;
    }
    return false;
  }, [ist]);

  useEffect(() => {
    if (characters.map((c: any) => c.nft.name).includes(characterData.name)) {
      setIsOfferAccepted(true);
      const [newCharacter] = characters.filter((c: any) => c.nft.name === characterData.name);
      setMintedCharacter(newCharacter.nft);
      setIsLoading(false);
    }
    if(error) console.error(`Error in create-character-mobile: ${error}`);

  }, [characters, characterData, notEnoughIST]);

  const changeStep = async (step: number): Promise<void> => {
    setCurrentStep(step);
  };

  const errorCallback = (error: string) => {
    setError(error);
    setShowToast(true);
  };

  const handleResult: MakeOfferCallback = {
    error: errorCallback,
    accepted: () => {
      console.info("MintCharacter call settled");
    }
  };
  
  const sendOfferHandler = async (): Promise<void> => {
    setIsLoading(true);
    await createCharacter.mutateAsync({
      name: characterData.name,
      callback: handleResult,
    });
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
        return <Confirmation character={mintedCharacter} />;
      default:
        return <ErrorView />;
    }
  };

  if (isLoadingCharacters) return <LoadingPage spinner={false} />;

  return (
    <PageContainer
      sidebarContent={
        <FormCard>
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
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.error.mint.title}
            info={text.error.mint.invalidName}
            closeToast={() => setShowToast(false)}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </PageContainer>
  );
};
