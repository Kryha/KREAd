import { FC } from "react";

import { DetailSectionHeaderNavigation } from "../detail-section-header-navigation";
import {
  CategoryButton,
  DetailSectionHeaderDetails,
  DetailSectionHeaderId,
  DetailSectionHeaderTop,
  DetailSectionHeaderWrap,
} from "./styles";

import { text } from "../../../assets";
import { SectionHeader } from "../../../components";
import { DetailSectionActions } from "../types";

interface Data {
  name: string;
  category: string;
  id: string;
}

interface DetailSectionHeaderProps {
  data: Data;
  actions?: DetailSectionActions;
}

export const DetailSectionHeader: FC<DetailSectionHeaderProps> = ({ data, actions }) => {
  return (
    <DetailSectionHeaderWrap>
      <DetailSectionHeaderTop>
        <SectionHeader>{data.name}</SectionHeader>
        <DetailSectionHeaderNavigation actions={actions} />
      </DetailSectionHeaderTop>

      <DetailSectionHeaderDetails>
        <CategoryButton>{data.category}</CategoryButton>
        <DetailSectionHeaderId>{text.param.id(data.id)}</DetailSectionHeaderId>
      </DetailSectionHeaderDetails>
    </DetailSectionHeaderWrap>
  );
};
