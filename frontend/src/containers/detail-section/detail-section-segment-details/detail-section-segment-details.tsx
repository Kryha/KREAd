import { FC } from "react";

import { text } from "../../../assets";
import { FlexRow } from "../../../components";
import { Item } from "../../../interfaces";
import { DetailSectionElement } from "../detail-section-element";
import { DetailSectionBody } from "../detail-section-segment/styles";
import { DetailSectionSegmentDetailsWrap } from "./styles";

import { LinkExternalIcon } from "../../../assets/icons";
import { truncateAddress } from "../../../util";

interface DetailSectionSegmentDetailsProps {
  item: Item;
}

// TODO: Adjust flex view for smaller viewports
export const DetailSectionSegmentDetails: FC<DetailSectionSegmentDetailsProps> = ({ item }) => {
  return (
    <DetailSectionSegmentDetailsWrap>
      <FlexRow>
        <DetailSectionElement title={text.item.contractAddress}>
          <DetailSectionBody>{truncateAddress(item.details.contractAddresss)}</DetailSectionBody>
        </DetailSectionElement>
        <DetailSectionElement title={text.item.boardId}>
          <DetailSectionBody>#{item.details.boardId}</DetailSectionBody>
        </DetailSectionElement>
        <DetailSectionElement title={text.item.artist}>
          <DetailSectionBody>{item.details.artist}</DetailSectionBody>
        </DetailSectionElement>
        <DetailSectionElement title={text.item.metadata}>
          <DetailSectionBody>
            <a href={item.details.metadata} target="_blank" rel="noreferrer">
              {text.item.view} <LinkExternalIcon />
            </a>
          </DetailSectionBody>
        </DetailSectionElement>
      </FlexRow>
    </DetailSectionSegmentDetailsWrap>
  );
};
