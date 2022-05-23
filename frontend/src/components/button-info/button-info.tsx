import React, { FC } from "react";
import { SecondaryButton } from "../atoms";
import { Tooltip } from "../tooltip";
import { ButtonInfoWrap } from "./styles";

interface ButtonInfoProps {
  title: string;
  info: string;
}

export const ButtonInfo: FC<ButtonInfoProps> = ({ title, info }) => {
  return (
    <ButtonInfoWrap>
      <Tooltip title={title} content={info}>
        <SecondaryButton>i</SecondaryButton>
      </Tooltip>
    </ButtonInfoWrap>
  );
};
