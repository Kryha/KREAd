import { FC } from "react";

import { CloseIcon } from "../../assets";
import { TertiaryButton } from "../atoms";
import { ButtonCloseWrap } from "./styles";

interface ButtonCloseProps {
  onClick: () => void;
}

export const ButtonClose: FC<ButtonCloseProps> = ({ onClick }) => {
  return (
    <ButtonCloseWrap>
      <TertiaryButton onClick={() => onClick()}>
        <CloseIcon />
      </TertiaryButton>
    </ButtonCloseWrap>
  );
};
