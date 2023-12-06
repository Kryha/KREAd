import React, { FC } from "react";
import { ButtonText } from "../atoms";
import { useClickAwayListener } from "../../hooks";
import { NetworkSelectorContainer, NetworkSelectorOption, NetworkSelectorWrapper, Triangle } from "./styles";
import { networkOptions } from "../../constants";

interface NetworkSelectorProps {
  children?: React.ReactNode;
  label: string;
  openNetworkSelector: (id: string) => void;
  id: string;
  hasValue?: boolean;
}
export const NetworkSelector: FC<NetworkSelectorProps> = ({ children, label, openNetworkSelector, id, hasValue }) => {
  const filterRef = React.useRef<HTMLDivElement>(null);

  const closeNetworkSelector = () => {
    openNetworkSelector("");
  };
  useClickAwayListener(filterRef, id == label, closeNetworkSelector);
  return (
    <NetworkSelectorWrapper ref={filterRef}>
      <NetworkSelectorContainer isOpen={id === label} onClick={() => openNetworkSelector(label)} hasValue={hasValue}>
        <ButtonText>{label}</ButtonText>
        <Triangle />
      </NetworkSelectorContainer>
      <NetworkSelectorOption isOpen={id === label}>{children}</NetworkSelectorOption>
    </NetworkSelectorWrapper>
  );
};
export const getLabelForNetwork = (networkValue: string) => {
  const matchingOption = networkOptions.find((option) => option.value === networkValue);
  return matchingOption ? matchingOption.label : "Unknown Network";
};
