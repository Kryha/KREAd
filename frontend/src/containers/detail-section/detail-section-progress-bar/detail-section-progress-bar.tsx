import { FC } from "react";
import { text } from "../../../assets";
import {
  DetailSectionProgressBarWrap,
  DetailSectionProgress,
  DetailSectionProgressDigits,
} from "./styles";

interface DetailSectionProgressBarProps {
  title: string;
  amount: number;
}

export const DetailSectionProgressBar: FC<DetailSectionProgressBarProps> = ({
  title,
  amount,
}) => {
  return (
    <DetailSectionProgressBarWrap>
      <DetailSectionProgress>
        <DetailSectionProgressValue value={amount} max={100} />
      </DetailSectionProgress>
      <DetailSectionProgressDigits>
        {text.param.nOutOfOnehundred(amount)}
      </DetailSectionProgressDigits>
    </DetailSectionProgressBarWrap>
  );
};
