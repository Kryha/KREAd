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
  onClose: () => void;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
}

interface Text {
  leftButton: string;
  rightButton: string;
}

interface DetailSectionHeaderProps {
  data: Data;
  actions: Actions;
  text: Text;
}

export const DetailSectionHeader: FC<DetailSectionHeaderProps> = ({ data, actions, text: pText }) => {
  return (
    <DetailSectionHeaderWrap>
      <DetailSectionHeaderTop>
        <SectionHeader>{data.name}</SectionHeader>
        <DetailSectionHeaderNavigation actions={actions} text={pText} />
      </DetailSectionHeaderTop>

      <DetailSectionHeaderDetails>
        <CategoryButton>{data.category}</CategoryButton>
        <DetailSectionHeaderId>{text.param.itemId(data.id)}</DetailSectionHeaderId>
      </DetailSectionHeaderDetails>
    </DetailSectionHeaderWrap>
  );
};
