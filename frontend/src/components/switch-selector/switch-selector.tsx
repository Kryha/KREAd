import React, { FC, useEffect } from "react";

import { Group, SwitchButtonLeft, SwitchButtonRight } from "./styles";
import { useLocation, useNavigate } from "react-router-dom";

interface SwitchSelectorProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  buttonOneText: string;
  buttonTwoText: string;
  toggleDevMode?: boolean;
}

export const SwitchSelector: FC<SwitchSelectorProps> = ({
  toggleDevMode = false,
  buttonOneText,
  buttonTwoText,
  selectedIndex,
  setSelectedIndex,
}) => {
  const handleButtonOneClick = () => {
    setSelectedIndex(0);
    toggleDevMode && window.location.reload(); // Reload the page
  };

  const handleButtonTwoClick = () => {
    setSelectedIndex(1);
    toggleDevMode && window.location.reload(); // Reload the page
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!toggleDevMode) {
      const currentURL = location.pathname;
      const queryParams = new URLSearchParams(location.search);
      if (selectedIndex === 0) {
        queryParams.set("section", "items");
      } else {
        queryParams.set("section", "characters");
      }
      const newURL = `${currentURL}?${queryParams.toString()}`;
      navigate(newURL, { replace: true });
    }
  }, [selectedIndex]);

  return (
    <Group>
      <SwitchButtonLeft onClick={handleButtonOneClick} selected={selectedIndex === 0}>
        {buttonOneText}
      </SwitchButtonLeft>
      <SwitchButtonRight onClick={handleButtonTwoClick} selected={selectedIndex === 1}>
        {buttonTwoText}
      </SwitchButtonRight>
    </Group>
  );
};
