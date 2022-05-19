import { FC } from "react";

import { DetailSectionSegment } from "./detail-section-segment";
import { DetailSectionHeader } from "./detail-section-header";
import { DetailSectionWrap } from "./styles";

import { LoadingPage } from "../../components";

import { useItem } from "../../service";

// TODO: Make index dynamic
export const DetailSection: FC = () => {
  const { data: item, isLoading: isLoadingItem } = useItem();

  if (isLoadingItem) return <LoadingPage />;

  // TODO: get an empty section
  if (!item) return <></>;

  return (
    <DetailSectionWrap>
      <DetailSectionHeader item={item} />
      <DetailSectionSegment title="Story" index={1} image={item.image}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Stats" index={2}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Project" index={3}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Details" index={4}>
        {item.description}
      </DetailSectionSegment>
      <DetailSectionSegment title="Item Activity" index={5}>
        {item.description}
      </DetailSectionSegment>
    </DetailSectionWrap>
  );
};
