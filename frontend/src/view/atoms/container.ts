import styled from "styled-components";

import { margins } from "../../design";

export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${margins.medium};
  align-items: center;
  width: 100%;
  text-align: center;
`;
