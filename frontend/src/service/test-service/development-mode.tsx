import React from "react";
import { PrimaryButton } from '../../components';
import styled from '@emotion/styled';

export const DevelopmentMode: React.FC = () => {
  const isDevelopmentMode = process.env.NODE_ENV === "development";

  const handleDevModeButtonClick = () => {
    // Add your logic here for handling the button click in development mode
    console.log("Dev Mode Button clicked");
  };

  if (!isDevelopmentMode) {
    return null;
  }

  return (
    <DevModeButtonContainer>
      <PrimaryButton onClick={handleDevModeButtonClick}>Dev Mode</PrimaryButton>
    </DevModeButtonContainer>

  );
};

const DevModeButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 40px;
  padding: 4px;
  z-index: 100;
`;

