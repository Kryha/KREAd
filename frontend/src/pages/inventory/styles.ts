import styled from "@emotion/styled";

import { Group } from "../../components/switch-selector/styles";
import { margins } from "../../design";

export const InventoryWrapper = styled.div`
  ${Group} {
    margin-left: ${margins.big};
    margin-bottom: ${margins.big};
  }
`;

export const OverviewContainer = styled.div`
  border: 1px solid #D0D0D0;
  border-radius: 24px;
  height: 80vh;
  width: 55%;
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 24px 8px 8px;
  gap: 24px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
`;
