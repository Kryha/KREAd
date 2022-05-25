import { FC } from "react";

import { CloseIcon } from "../../assets";
import { TertiaryButton } from "../atoms";
import { ButtonCloseWrap } from "./styles";

export const ButtonClose: FC = () => {
  return (
    <ButtonCloseWrap>
      <TertiaryButton>
        <CloseIcon />
      </TertiaryButton>
    </ButtonCloseWrap>
  );
};
