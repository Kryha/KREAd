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

interface DetailSectionHeaderProps {
  item: Item;
}

// TODO: Pass item actions as props (equip, sell)?
export const DetailSectionHeader: FC<DetailSectionHeaderProps> = ({ item }) => {
  return (
    <DetailSectionHeaderWrap>
      <DetailSectionHeaderTop>
        <h1>{item.name}</h1>
        <DetailSectionHeaderNavigation />
      </DetailSectionHeaderTop>

      <DetailSectionHeaderDetails>
        <CategoryButton>{item.category}</CategoryButton>
        <DetailSectionHeaderId>{item.id}</DetailSectionHeaderId>
      </DetailSectionHeaderDetails>
    </DetailSectionHeaderWrap>
  );
};
