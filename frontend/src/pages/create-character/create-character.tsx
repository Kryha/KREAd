import { FC, useState } from "react";

import { DefaultIcon, text } from "../../assets";
import { ErrorView, FormHeader } from "../../components";
import { PageContainer } from "../../components/page-container";
import { PAYMENT_STEP } from "../../constants";
import { useServiceState } from "../../context/service";
import { useViewport } from "../../hooks";
import { CharacterCreation } from "../../interfaces";
import { routes } from "../../navigation";
import { useCreateCharacter } from "../../service";
import { makeBidOfferForCharacter, mintCharacters } from "../../service/character-actions";
import { FakeCharctersNoItems } from "../../service/fake-characters";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { Payment } from "./payment";
import { DefaultImage, FormCard } from "./styles";

export const CreateCharacter: FC = () => {
  const service = useServiceState();
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [character, setCharacter] = useState<any>();
  const createCharacter = useCreateCharacter();

  const changeStep = async (step: number): Promise<void> => {
    setCurrentStep(step);
  };

  const sendOfferHandler = async (): Promise<void> => {
    await makeBidOfferForCharacter(service, character.auction.publicFacet, character.character, 10n);
  };

  const submitForm = async (data: CharacterCreation): Promise<void> => {
    // createCharacter.mutate(data);
    const baseCharacter = FakeCharctersNoItems[0];
    const newCharacter = { ...baseCharacter, name: data.name };
    const bought = await mintCharacters(service, [newCharacter], 1n);

    // setCurrentStep(PAYMENT_STEP);
    // setCharacter(createCharacter.data);
    if (bought) {
      setCurrentStep(PAYMENT_STEP);
      setCharacter({ character: newCharacter, auction: { publicFacet: bought.auctionItemsPublicFacet } });
    }
  };


  if (createCharacter.isError) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return <Information submitForm={submitForm} disabled={createCharacter.isLoading} />;
      case 1:
        return <Payment sendOfferHandler={()=>sendOfferHandler()} submit={changeStep} />;
      case 2:
        return <Confirmation character={character.character} />;
      default:
        return <Information submitForm={submitForm} disabled={createCharacter.isLoading} />;
    }
  };

  return (
    <PageContainer
      sidebarContent={
        <FormCard height={height} width={width}>
          <FormHeader
            currentStep={currentStep}
            title={text.mint.mintNew}
            link={routes.character}
          />
          <>{perStepDisplay()}</>
        </FormCard>
      }
    >
      <DefaultImage src={DefaultIcon} alt={text.character.defaultCharacter} height={height} width={width} />
    </PageContainer>
  );
};
