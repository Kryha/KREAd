import { FC, useState } from "react";

import { DefaultIcon, text } from "../../assets";
import { ErrorView, FormHeader } from "../../components";
import { PageContainer } from "../../components/page-container";
import { PAYMENT_STEP } from "../../constants";
import { useViewport } from "../../hooks";
import { Character, CharacterCreation } from "../../interfaces";
import { routes } from "../../navigation";
import { useCreateCharacter } from "../../service";
import { FakeCharcters } from "../../service/fake-characters";
import { Confirmation } from "./confirmation";
import { Information } from "./information";
import { Payment } from "./payment";
import { DefaultImage, FormCard } from "./styles";

export const CreateCharacter: FC = () => {
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [character, setCharacter] = useState<Character>();
  // const createCharacter = useCreateCharacter();

  const changeStep = (step: number): void => {
    setCurrentStep(step);
  };

  const submitForm = (data: CharacterCreation): void => {
    // createCharacter.mutate(data);
    // if (createCharacter.isSuccess) {
    setCurrentStep(PAYMENT_STEP);
    setCharacter(FakeCharcters[3]);
    // }
  };

  // if (createCharacter.isError) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return <Information submitForm={submitForm} disabled={false} />;
      case 1:
        return <Payment changeStep={changeStep} />;
      case 2:
        return <Confirmation character={character} />;
      default:
        return <Information submitForm={submitForm} disabled={false} />;
    }
  };

  return (
    <PageContainer
      sidebarContent={
        <FormCard height={height} width={width}>
          <FormHeader
            currentStep={currentStep}
            title={text.mint.mintNew}
            link={routes.root}
          />
          <>{perStepDisplay()}</>
        </FormCard>
      }
    >
      <DefaultImage src={DefaultIcon} alt={text.character.defaultCharacter} height={height} width={width} />
    </PageContainer>
  );
};
