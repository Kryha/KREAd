import { FC } from "react";

import { ButtonCloseWrap, Close } from "./styles";

interface ButtonCloseProps {
  onClick: () => void;
}

export const ButtonClose: FC<ButtonCloseProps> = ({ onClick }) => {
  return (
    <ButtonCloseWrap>
      <Close onClick={() => onClick()} />
    </ButtonCloseWrap>
  );
};
