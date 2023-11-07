import styled from "@emotion/styled";
import { breakpoints, margins } from "../../design";

interface AssetsProps {
  height: number;
}

export const AssetsShopWrapper = styled.div<AssetsProps>`
  flex: 1 0 450px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

export const AssetsWrapper = styled.div<AssetsProps>`
  flex: 1 0 450px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;
export const AssetsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${margins.small};
  list-style-type: none;
  isolation: isolate;
  flex-direction: column;
  padding-right: 8px;

  @media screen and (max-width: ${breakpoints.mobile}) {
    padding-left: 8px;
    padding-right: 8px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;
