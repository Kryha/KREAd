import styled from "@emotion/styled";
import { breakpoints, margins } from "../../design";

interface AssetsProps {
  height: number;
}

export const ShopWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const FilterWrapper = styled.div<AssetsProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 250}px;`};
  width: 50%;
`;
export const AssetsShopWrapper = styled.div<AssetsProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 280}px;`};
  width: 100%;
`;

export const AssetsWrapper = styled.div<AssetsProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 200}px;`};
`;
export const AssetsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${margins.small};
  list-style-type: none;
  isolation: isolate;
  flex-direction: column;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;

  @media screen and (max-width: ${breakpoints.mobile}) {
    padding-left: 8px;
    padding-right: 8px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;
