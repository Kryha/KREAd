import { FC } from "react";

import { DetailSectionHeaderNavigation } from "../detail-section-header-navigation";
import { DetailSectionHeaderDetails, DetailSectionHeaderTop, DetailSectionHeaderWrap } from "./styles";
import { SectionHeader } from "../../../components";
import { DetailSectionActions } from "../types";

interface Data {
  name: string;
  category?: string;
  title?: string;
  origin?: string;
}

interface DetailSectionHeaderProps {
  data: Data;
  actions?: DetailSectionActions;
}

// TODO: Need to separate this for items and characters
export const DetailSectionHeader: FC<DetailSectionHeaderProps> = ({ data, actions }) => {
  return (
    <DetailSectionHeaderWrap>
      <DetailSectionHeaderTop>
        <SectionHeader preserveCase>{data.name}</SectionHeader>
        <DetailSectionHeaderNavigation actions={actions} />
      </DetailSectionHeaderTop>

      <DetailSectionHeaderDetails></DetailSectionHeaderDetails>
    </DetailSectionHeaderWrap>
  );
};
