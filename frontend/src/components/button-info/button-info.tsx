import React, { FC } from "react";
import { text } from "../../assets";
import { InfoPosition } from "../../interfaces/layout.types";
import { SecondaryButton } from "../atoms";
import { Tooltip } from "../tooltip";
import { ButtonInfoWrap } from "./styles";

interface ButtonInfoProps {
  title: string;
  info: string;
  infoPosition?: InfoPosition;
}

export const ButtonInfo: FC<ButtonInfoProps> = ({ title, info, infoPosition }) => {
  return (
    <ButtonInfoWrap>
      <Tooltip title={title} content={info} position={infoPosition}>
        <SecondaryButton>{text.general.info}</SecondaryButton>
      </Tooltip>
    </ButtonInfoWrap>
  );
};
