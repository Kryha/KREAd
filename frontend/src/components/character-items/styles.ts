import styled from "@emotion/styled";
import { margins } from "../../design";

export const LeftItemContainer = styled.div`
  position: absolute;
  width: 310px;
  height: 408px;
  left: ${margins.small};
  bottom: ${margins.big};
`;

export const RightItemContainer = styled.div`
  position: absolute;
  width: 310px;
  height: 408px;
  right: ${margins.big};
  bottom: ${margins.big};
`;

export const RightItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: -20px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 24px 0px;
`;

export const Conta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 24px 0px;
`;
