import { FC } from "react";

import { DetailSectionHeaderNavigation } from "../detail-section-header-navigation";
import { DetailSectionHeaderDetails, DetailSectionHeaderTop, DetailSectionHeaderWrap } from "./styles";
import { ErrorView, SectionHeader } from "../../../components";
import { DetailSectionActions } from "../types";
import { isCharacterCategory, isItemCategory } from "../../../interfaces";

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
  if (!isItemCategory(data.category) && !isCharacterCategory(data.title)) return <ErrorView />;
  return (
    <DetailSectionHeaderWrap>
      <DetailSectionHeaderTop>
        <SectionHeader>{data.name}</SectionHeader>
        <DetailSectionHeaderNavigation actions={actions} />
      </DetailSectionHeaderTop>

      <DetailSectionHeaderDetails></DetailSectionHeaderDetails>
    </DetailSectionHeaderWrap>
  );
};
