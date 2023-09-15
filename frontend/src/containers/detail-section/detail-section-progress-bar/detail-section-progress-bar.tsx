import { FC } from "react";
import { text } from "../../../assets";
import { DetailSectionProgress, DetailSectionProgressBarWrap, DetailSectionProgressDigits, DetailSectionProgressValue } from "./styles";

interface DetailSectionProgressBarProps {
  title: string;
  amount: number;
}

export const DetailSectionProgressBar: FC<DetailSectionProgressBarProps> = ({ amount }) => {
  return (
    <DetailSectionProgressBarWrap>
      <DetailSectionProgress>
        <DetailSectionProgressValue value={amount} max={100} />
      </DetailSectionProgress>
      <DetailSectionProgressDigits>{text.param.nOutOfOnehundred(amount)}</DetailSectionProgressDigits>
    </DetailSectionProgressBarWrap>
  );
};
