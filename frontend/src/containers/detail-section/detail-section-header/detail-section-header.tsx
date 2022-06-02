import { FC } from "react";

import { DetailSectionHeaderNavigation } from "../detail-section-header-navigation";
import {
  CategoryButton,
  DetailSectionHeaderDetails,
  DetailSectionHeaderId,
  DetailSectionHeaderTop,
  DetailSectionHeaderWrap,
} from "./styles";

import { Item } from "../../../interfaces";
import { text } from "../../../assets";
import { SectionHeader } from "../../../components";

interface DetailSectionHeaderProps {
  item: Item;
  handleClose: () => void;
}

// TODO: Pass item actions as props (equip, sell)?
export const DetailSectionHeader: FC<DetailSectionHeaderProps> = ({ item, handleClose }) => {
  return (
    <DetailSectionHeaderWrap>
      <DetailSectionHeaderTop>
        <SectionHeader>{item.name}</SectionHeader>
        <DetailSectionHeaderNavigation handleClose={handleClose} />
      </DetailSectionHeaderTop>

      <DetailSectionHeaderDetails>
        <CategoryButton>{item.category}</CategoryButton>
        <DetailSectionHeaderId>{text.param.itemId(item.id)}</DetailSectionHeaderId>
      </DetailSectionHeaderDetails>
    </DetailSectionHeaderWrap>
  );
};
