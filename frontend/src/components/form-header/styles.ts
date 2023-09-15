import styled from "@emotion/styled";

import { margins } from "../../design";

export const FormNavigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 0;
  margin-top: ${margins.big};
  width: 100%;
`;

export const NavigationTab = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;
  gap: ${margins.medium};
`;
