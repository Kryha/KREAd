import React, { FC, useEffect, useMemo, useState } from "react";
import { ElephiaCitizen, text } from "../../assets";
import { ErrorView, FadeInOut, FormHeader, LoadingPage, NotificationDetail, Overlay } from "../../components";
import { PageContainer } from "../../components/page-container";
import { MINTING_COST, MINT_CHARACTER_FLOW_STEPS, WALLET_INTERACTION_STEP } from "../../constants";
import { useIsMobile, useViewport } from "../../hooks";
import { Character, CharacterCreation } from "../../interfaces";
import { routes } from "../../navigation";
import { useCreateCharacter } from "../../service";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { Payment } from "./payment";
import { DefaultImage, FormCard } from "./styles";
import { breakpoints } from "../../design";
import { useUserState } from "../../context/user";
import { useWalletState } from "../../context/wallet";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { handleOfferResultBuilder } from "../../util/contract-callbacks";

export const CreateCharacter: FC = () => {
  const createCharacter = useCreateCharacter();
  const { width, height } = useViewport();
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
  const mobile = useIsMobile(breakpoints.desktop);
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
  }, [characters, characterData, notEnoughIST]);

  const changeStep = async (step: number): Promise<void> => {
    setCurrentStep(step);
  };

  const errorCallback = (error: string) => {
    setError(error);
    setShowToast(true);
  };

  const successCallback = () => {
    console.info("MintCharacter call settled");
  };

  const sendOfferHandler = async (): Promise<void> => {
    setIsLoading(true);
    await createCharacter.mutateAsync({
      name: characterData.name,
      callback: handleOfferResultBuilder(errorCallback, errorCallback, successCallback),
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
      {!mobile && <DefaultImage src={ElephiaCitizen} alt={text.character.defaultCharacter} height={height} width={width} />}
    </PageContainer>
  );
};
