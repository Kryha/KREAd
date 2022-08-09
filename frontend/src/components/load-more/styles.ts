import styled from "@emotion/styled";
import { RefreshIcon } from "../../assets";
import { margins } from "../../design";

export const LoadMoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Refresh = styled(RefreshIcon)`
  margin-left: ${margins.mini};
`;
