import React, { FC } from "react";

import { FilterOption, FiltersContainer, FiltersWrapper, Triangle } from "./styles";
import { ButtonText } from "../atoms";
import { useClickAwayListener } from "../../hooks/use-click-away-listener";

interface FiltersProps {
  children?: React.ReactNode;
  label: string;
  value?: string;
  openFilter: (id: string) => void;
  id: string;
  hasValue?: boolean;
}

export const Filters: FC<FiltersProps> = ({ children, label, value, openFilter, id, hasValue }) => {
  const filterRef = React.useRef<HTMLDivElement>(null);

  const closeFilter = () => {
    openFilter("");
  };
  useClickAwayListener(filterRef, id == label, closeFilter);

  return (
    <FiltersWrapper ref={filterRef}>
      <FiltersContainer isOpen={id === label} onClick={() => openFilter(label)} hasValue={hasValue}>
        <ButtonText>{value ? value : label}</ButtonText>
        <Triangle />
      </FiltersContainer>
      <FilterOption isOpen={id === label}>{children}</FilterOption>
    </FiltersWrapper>
  );
};
