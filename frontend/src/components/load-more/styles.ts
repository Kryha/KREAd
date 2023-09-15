import styled from "@emotion/styled";
import { RefreshIcon } from "../../assets";
import { color, margins } from "../../design";

export const LoadMoreWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  padding: ${margins.mini};
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.mini};
  align-items: center;
`;
export const LoadMoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  gap: ${margins.medium};
  align-items: center;
`;

export const Refresh = styled(RefreshIcon)`
  width: 50px;
  height: 50px;
`;
