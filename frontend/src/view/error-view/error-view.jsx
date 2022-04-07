import React from "react";
import { useNavigate } from "react-router-dom";

import { ErrorIcon } from "./styles";
import { ButtonBase, Heading, CenteredContainer } from "../atoms";
import { text } from "../../assets/text";
import { routes } from "../../navigation";
import { color } from "../../design";

export const ErrorView = ({ redirectRoute, headingText, navigationText, onButtonClick }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) return onButtonClick();
    navigate(redirectRoute || routes.root);
  };

  return (
    <CenteredContainer>
      <Heading customColor={color.black}>{headingText || text.error.somethingWentWrong}</Heading>
      <ErrorIcon />
      <ButtonBase onClick={() => handleButtonClick()}>{navigationText || text.navigation.goHome}</ButtonBase>
    </CenteredContainer>
  );
};
