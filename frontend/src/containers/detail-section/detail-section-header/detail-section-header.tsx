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

interface Data {
  name: string;
  category: string;
  id: string;
}

interface Actions {
  onClose?: () => void;
  primary?: {
    text: string;
    onClick: () => void;
  };
  secondary?: {
    text: string;
    onClick: () => void;
  };
}

interface DetailSectionHeaderProps {
  data: Data;
  actions: Actions;
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
        <DetailSectionHeaderId>{text.param.itemId(data.id)}</DetailSectionHeaderId>
      </DetailSectionHeaderDetails>
    </DetailSectionHeaderWrap>
  );
};
