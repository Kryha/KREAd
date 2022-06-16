import styled from "@emotion/styled";
import { CloseIcon } from "../../assets";
import { color, margins } from "../../design";

export const Close = styled(CloseIcon)`
  width: 12px;
  height: 12px;
  margin-left: 46px;
  margin-top: 10px;
  cursor: pointer;
`;

export const ButtonCloseWrap = styled.div`
  border-left: 1px solid ${color.grey};
  margin-left: ${margins.small};
`;
