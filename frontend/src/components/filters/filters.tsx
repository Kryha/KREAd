import React, { FC } from "react";

import { FilterOption, FiltersContainer, FiltersWrapper, Triangle } from "./styles";
import { ButtonText } from "../atoms";
import { useClickAwayListener } from "../../hooks";

interface FiltersProps {
  children?: React.ReactNode;
  label: string;
  openFilter: (id: string) => void;
  id: string;
  hasValue?: boolean;
}

export const Filters: FC<FiltersProps> = ({ children, label, openFilter, id, hasValue }) => {
  const filterRef = React.useRef<HTMLDivElement>(null);

  const closeFilter = () => {
    openFilter("");
  };
  useClickAwayListener(filterRef, id == label, closeFilter);

  return (
    <FiltersWrapper ref={filterRef}>
      <FiltersContainer isOpen={id === label} onClick={() => openFilter(label)} hasValue={hasValue}>
        <ButtonText>{label}</ButtonText>
        <Triangle />
      </FiltersContainer>
      <FilterOption isOpen={id === label}>{children}</FilterOption>
    </FiltersWrapper>
  );
};
