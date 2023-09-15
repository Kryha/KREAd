import { SwitchSelector } from "../switch-selector";
import styled from "@emotion/styled";
import { fontSize, margins } from "../../design";
import React from "react";
import { useDataMode } from "../../hooks";

export const DataModeSelector = () => {
  const { isMockData, toggleDataMode } = useDataMode();

  return (
    <SelectDataMode>
      <SwitchSelector
        buttonOneText={"Default"}
        buttonTwoText={"Mock"}
        setSelectedIndex={toggleDataMode}
        selectedIndex={isMockData}
        toggleDevMode={true}
      />
    </SelectDataMode>
  );
};
const SelectDataMode = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: ${fontSize.tiny};
  align-items: center;
  gap: ${margins.mini};
`;
