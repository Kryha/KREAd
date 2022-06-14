import { FC } from "react";

import { text } from "../../../assets";
import { FlexRow } from "../../../components";
import { DetailSectionElement } from "../detail-section-element";
import { DetailSectionBody } from "../detail-section-segment/styles";
import { DetailSectionSegmentDetailsWrap, DetailSectionSegmentDetailsLink } from "./styles";

import { LinkExternalIcon } from "../../../assets/icons";
import { truncateAddress } from "../../../util";

interface Data {
  brand: string;
  boardId: string;
  artist: string;
  metadata: string;
}

interface DetailSectionSegmentDetailsProps {
  data: Data;
}

// TODO: Adjust flex view for smaller viewports
export const DetailSectionSegmentDetails: FC<DetailSectionSegmentDetailsProps> = ({ data }) => {
  return (
    <DetailSectionSegmentDetailsWrap>
      <FlexRow>
        <DetailSectionElement title={text.item.brand}>
          <DetailSectionBody>{truncateAddress(data.brand)}</DetailSectionBody>
        </DetailSectionElement>
        <DetailSectionElement title={text.item.boardId}>
          <DetailSectionBody>
            {text.item.boardIdHash}
            {data.boardId}
          </DetailSectionBody>
        </DetailSectionElement>
        <DetailSectionElement title={text.item.artist}>
          <DetailSectionBody>{data.artist}</DetailSectionBody>
        </DetailSectionElement>
        <DetailSectionElement title={text.item.metadata}>
          <DetailSectionBody>
            {/* TODO: redirect to a real place */}
            <DetailSectionSegmentDetailsLink href={data.metadata} target="_blank" rel="noreferrer">
              {text.item.view} <LinkExternalIcon />
            </DetailSectionSegmentDetailsLink>
          </DetailSectionBody>
        </DetailSectionElement>
      </FlexRow>
    </DetailSectionSegmentDetailsWrap>
  );
};
