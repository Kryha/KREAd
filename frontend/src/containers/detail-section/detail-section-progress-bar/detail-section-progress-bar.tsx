import React, { FC } from "react";
import { DetailSectionProgressBarWrap } from "./styles";

interface DetailSectionProgressBarProps {
  title: string;
  amount?: number;
}

export const DetailSectionProgressBar: FC<DetailSectionProgressBarProps> = ({ title, amount }) => {
  return (
    <DetailSectionProgressBarWrap>
      <label>{title}</label>
      <progress id={title} value={amount} max="100">
        {amount}
      </progress>
      <span>{amount} / 100</span>
    </DetailSectionProgressBarWrap>
  );
};
