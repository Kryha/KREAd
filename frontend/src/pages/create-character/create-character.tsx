import { FC, useEffect, useState } from "react";
import { DefaultIcon, text } from "../../assets";
import { FormHeader, LoadingPage } from "../../components";
import { PageContainer } from "../../components/page-container";
import { PAYMENT_STEP } from "../../constants";
import { useViewport } from "../../hooks";
import { Character, CharacterCreation, ExtendedCharacter } from "../../interfaces";
import { routes } from "../../navigation";
import { useCreateCharacter, useMyCharacters } from "../../service";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { Payment } from "./payment";
import { DefaultImage, FormCard } from "./styles";

export const CreateCharacter: FC = () => {
  const createCharacter = useCreateCharacter();
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [mintedCharacter, setMintedCharacter] = useState<ExtendedCharacter>();
  const [characterdata, setCharacterData] = useState<CharacterCreation>({ name: "" });
  const [myCharacters, isLoadingCharacters] = useMyCharacters();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState<boolean>(false);

  // TODO: Implement wallet listener for cases where the user doesn't approve the mint
  // const [isWalletError, setIsWalletError] = useState<boolean>(false);

  useEffect(() => {
    if (myCharacters.map((c) => c.nft.name).includes(characterdata.name)) {
      setIsOfferAccepted(true);
      const [newCharacter] = myCharacters.filter((character) => character.nft.name === characterdata.name);
      setMintedCharacter(newCharacter);
      setIsLoading(false);
    }
  }, [myCharacters, characterdata]);

  const changeStep = async (step: number): Promise<void> => {
    setCurrentStep(step);
  };

  const sendOfferHandler = async (): Promise<void> => {
    setIsLoading(true);
    await createCharacter.mutateAsync({ name: characterdata.name });
  };

  const setData = async (data: CharacterCreation): Promise<void> => {
    setCharacterData(data);
    setCurrentStep(PAYMENT_STEP);
  };

  // if (createCharacter.isError) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return <Information setData={setData} disabled={createCharacter.isLoading} />;
      case 1:
        return <Payment sendOfferHandler={sendOfferHandler} submit={changeStep} isOfferAccepted={isOfferAccepted} isLoading={isLoading} />;
      case 2:
        return <Confirmation character={mintedCharacter?.nft} />;
      default:
        return <Information setData={setData} disabled={createCharacter.isLoading} />;
    }
  };

  if (isLoadingCharacters) return <LoadingPage />;

  return (
    <PageContainer
      sidebarContent={
        <FormCard height={height} width={width}>
          <FormHeader currentStep={currentStep} title={text.mint.mintNew} link={routes.character} />
          {perStepDisplay()}
        </FormCard>
      }
    >
      <DefaultImage src={DefaultIcon} alt={text.character.defaultCharacter} height={height} width={width} />
    </PageContainer>
  );
};
