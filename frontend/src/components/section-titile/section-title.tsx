import { FC } from "react";
import { color } from "../../design";

import { BoldLabel, MenuText } from "../atoms";
import { SectionTitleWrapper } from "./styles";

interface SectionTitleProps {
  title: string;
  index: string;
};

export const SectionTitle: FC<SectionTitleProps> = ({ title, index }) => {
  return (
    <SectionTitleWrapper>
      <BoldLabel customColor={color.black}>{index}</BoldLabel>
      <MenuText>{title}</MenuText>
    </SectionTitleWrapper>
  );
};
