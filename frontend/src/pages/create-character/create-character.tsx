import { FC, useState } from "react";

import { DefaultIcon, text } from "../../assets";
import { FormHeader } from "../../components";
import { PageContainer } from "../../components/page-container";
import { useViewport } from "../../hooks";
import { DefaultImage, FormCard } from "./styles";

export const CreateCharacter: FC = () => {
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const changeStep = (step: number): void => {
    setCurrentStep(step);
  };

  return (
    <PageContainer
      mainContent={
        <DefaultImage
          src={DefaultIcon}
          alt={text.character.defaultCharacter}
          height={height}
          width={width}
        />}
      sidebarContent={
        <FormCard height={height} width={width}>
          <FormHeader changeStep={changeStep} currentStep={currentStep} />
        </FormCard>
      }
    />
  );
};
