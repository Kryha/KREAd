import React, { FC, useEffect, useMemo, useState } from "react";
import { ElephiaCitizen, text } from "../../assets";
import { ErrorView, FadeInOut, FormHeader, LoadingPage, NotificationDetail, Overlay } from "../../components";
import { PageContainer } from "../../components/page-container";
import { MINTING_COST, MINT_CALL_TIMEOUT, MINT_CHARACTER_FLOW_STEPS, WALLET_INTERACTION_STEP } from "../../constants";
import { useIsMobile, useViewport } from "../../hooks";
import { Character, CharacterCreation, MakeOfferCallback } from "../../interfaces";
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
import { useNavigate } from "react-router-dom";

export const CreateCharacter: FC = () => {
  const navigate = useNavigate();
  const createCharacter = useCreateCharacter();
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [mintedCharacter, setMintedCharacter] = useState<Character>();
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string>(text.error.mint.general);
  const [characterData, setCharacterData] = useState<{ name: string }>({
    name: "",
  });
  const { characters, fetched } = useUserState();
  const isLoadingCharacters = !fetched;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState<boolean>(false);
  const [timeoutHandler, setTimeoutHandler] = useState<NodeJS.Timeout>();
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
      clearTimeout(timeoutHandler);
      const [newCharacter] = characters.filter((c: any) => c.nft.name === characterData.name);
      setMintedCharacter(newCharacter.nft);
      setIsLoading(false);
    }
  }, [characters, characterData, notEnoughIST, timeoutHandler]);

  const changeStep = async (step: number): Promise<void> => {
    setCurrentStep(step);
  };

  const errorCallback = (error: string) => {
    console.error(error);
    setShowToast(true);
  };

  const handleResult: MakeOfferCallback = {
    error: errorCallback,
    accepted: () => {
      clearTimeout(timeoutHandler);
    },
    seated: () => {
      const mintTimeout = setTimeout(() => {
        setError(text.error.mint.callStuck);
        setShowToast(true);
      }, MINT_CALL_TIMEOUT);
      setTimeoutHandler(mintTimeout);
    }
  };
  
  const sendOfferHandler = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await createCharacter.mutateAsync({
        name: characterData.name,
        callback: handleResult,
      });
    } catch(e) {
      setShowToast(true);
    }
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
            info={error}
            closeToast={() => {
              setShowToast(false);
              navigate(routes.character);
            }}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
      {!mobile && <DefaultImage src={ElephiaCitizen} alt={text.character.defaultCharacter} height={height} width={width} />}
    </PageContainer>
  );
};
