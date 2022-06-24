import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { OverviewWrapper } from "./styles";
import { PrimaryButton, ButtonText, MenuText, BodyText } from "../atoms";
import { text } from "../../assets/text";
import { routes } from "../../navigation";
import { color } from "../../design";

interface OverviewProps {
  headingText?: string;
  descriptionText?: string;
  buttonText?: string;
  redirectRoute?: string;
  onButtonClick?: () => void;
}

export const OverviewEmpty: FC<OverviewProps> = ({ redirectRoute, headingText, buttonText, descriptionText, onButtonClick }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) return onButtonClick();
    navigate(redirectRoute || routes.character);
  };

  return (
    <OverviewWrapper>
      <MenuText>{headingText || text.general.dataNotFound}</MenuText>
      <BodyText>{descriptionText || text.general.thereAreNoAssetsAvailable}</BodyText>
      <PrimaryButton onClick={handleButtonClick}>
        <ButtonText customColor={color.white}>{buttonText || text.general.goHome}</ButtonText>
      </PrimaryButton>
    </OverviewWrapper>
  );
};
