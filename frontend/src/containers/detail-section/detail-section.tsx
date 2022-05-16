import { FC } from "react";
import { DetailSectionSegment } from "./detail-section-segment";
import { Item } from "../../interfaces";

import { DetailSectionWrap } from "./styles";
import { DetailSectionHeader } from "./detail-section-header";

const mockedItem: Item = {
  name: "My Item",
  id: "42",
  code: "0945",
  image: "https://via.placeholder.com/512x512.png",
  equipped: true,
  category: "mocked",
  price: 55,
  amount: 1,
  description: "This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone."
};

export const DetailSection: FC = () => {
  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={mockedItem}/>
      <DetailSectionSegment title="Story" index={1} image={mockedItem.image}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Stats" index={2}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Project" index={3}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Details" index={4}>
        {mockedItem.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Item Activity" index={5}>
        {mockedItem.description}
      </DetailSectionSegment>
    </DetailSectionWrap>
  )
};
