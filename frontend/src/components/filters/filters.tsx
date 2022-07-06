import { FC, useState } from "react";

import { FiltersWrapper, Triangle, FiltersContainer, FilterOption } from "./styles";
import { ButtonText } from "../atoms";

interface FiltersProps {
  children?: React.ReactNode;
  label: string;
  value?: string;
  isOpen?: boolean;
  openFilter: (id: string) => void;
  id: string;
}

export const Filters: FC<FiltersProps> = ({ children, label, value, openFilter, id }) => {
  const [open, setOpened] = useState(false);

  return (
    <FiltersWrapper>
      <FiltersContainer isOpen={id === label} onClick={() => openFilter(label)}>
        <ButtonText>{value ? value : label}</ButtonText>
        <Triangle />
      </FiltersContainer>
      <FilterOption isOpen={id === label}>{children}</FilterOption>
    </FiltersWrapper>
  );
};
