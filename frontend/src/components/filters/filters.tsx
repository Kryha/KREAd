import { FC } from "react";

import { FiltersWrapper, Triangle, FiltersContainer, FilterOption } from "./styles";
import { ButtonText } from "../atoms";

interface FiltersProps {
  children?: React.ReactNode;
  label: string;
  value?: string;
  openFilter: (id: string) => void;
  id: string;
  hasValue?: boolean;
}

export const Filters: FC<FiltersProps> = ({ children, label, value, openFilter, id, hasValue }) => {
  return (
    <FiltersWrapper>
      <FiltersContainer isOpen={id === label} onClick={() => openFilter(label)} hasValue={hasValue}>
        <ButtonText>{value ? value : label}</ButtonText>
        <Triangle />
      </FiltersContainer>
      <FilterOption isOpen={id === label}>{children}</FilterOption>
    </FiltersWrapper>
  );
};
