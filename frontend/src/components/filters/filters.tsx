import { FC, useState } from "react";

import { FiltersWrapper, Triangle, FiltersContainer, FilterOption } from "./styles";
import { ButtonText } from "../atoms";

interface FiltersProps {
  children?: React.ReactNode;
  label: string;
  value?: string;
}

export const Filters: FC<FiltersProps> = ({ children, label, value }) => {
  const [open, setOpened] = useState(false);
  return (
    <FiltersWrapper>
      <FiltersContainer isOpen={open} onClick={() => setOpened(!open)}>
        <ButtonText>{value ? value : label}</ButtonText>
        <Triangle />
      </FiltersContainer>
      <FilterOption isOpen={open}>{children}</FilterOption>
    </FiltersWrapper>
  );
};
