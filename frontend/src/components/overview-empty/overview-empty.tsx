import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { OverviewWrapper } from "./styles";
import {
  ButtonText,
  MenuText,
  BodyText,
  SecondaryButton,
  PrimaryButton,
} from "../atoms";
import { text } from "../../assets/text";
import { routes } from "../../navigation";
import { color } from "../../design";

interface OverviewProps {
  headingText?: string;
  descriptionText?: string;
  buttonText?: string;
  redirectRoute?: string;
  onButtonClick?: () => void;
  secondary?: boolean;
}

export const OverviewEmpty: FC<OverviewProps> = ({
  redirectRoute,
  headingText,
  buttonText,
  descriptionText,
  onButtonClick,
  secondary = false,
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) return onButtonClick();
    navigate(redirectRoute || routes.character);
  };

  return (
    <OverviewWrapper>
      <MenuText>{headingText || text.general.dataNotFound}</MenuText>
      <BodyText>
        {descriptionText || text.general.thereAreNoAssetsAvailable}
      </BodyText>
      {buttonText && secondary && (
        <SecondaryButton onClick={() => handleButtonClick()}>
          <ButtonText customColor={color.white}>
            {buttonText || text.general.goHome}
          </ButtonText>
        </SecondaryButton>
      )}
      {buttonText && !secondary && (
        <PrimaryButton onClick={() => handleButtonClick()}>
          <ButtonText customColor={color.white}>
            {buttonText || text.general.goHome}
          </ButtonText>
        </PrimaryButton>
      )}
    </OverviewWrapper>
  );
};
