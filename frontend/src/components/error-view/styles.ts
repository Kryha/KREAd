import styled from "styled-components";

import { color, margins } from "../../design";
import { ErrorIcon as RawIcon } from "../../assets/icons";

export const ErrorIcon = styled(RawIcon)`
  path {
    fill: ${color.black};
  };
  width: 250px;
  height: 250px;
  margin-top: ${margins.big};
  margin-bottom: ${margins.big};
`;
