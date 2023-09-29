import styled from "@emotion/styled";
import { ButtonText, fadeUp, HorizontalDivider, Label, SecondaryButton } from "../atoms";
import { breakpoints, color, fontSize, margins } from "../../design";
import { FilterOption } from "../filters/styles";

interface AssetFilterViewProps {
  height: number;
  width: number;
  showFilter?: boolean;
}

export const AssetHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;
export const AssetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
export const AssetFilterCount = styled(ButtonText)`
  margin-left: ${margins.mini};
`;
export const AssetFilterWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0;
  z-index: 30;
  ${HorizontalDivider} {
    margin-top: 4px;
  }
  animation: ${fadeUp} 1.2s ease-out 0s forwards;
  opacity: 0;
  transform: translate3d(0, 1rem, 0);
`;

export const AssetFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0;
  gap: 16px;

  @media screen and (max-width: ${breakpoints.desktop}) {
    flex-direction: column;
  }
`;

export const AssetSelectorContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: row;
  align-items: flex-start;
`;

export const PageMetricsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SortAssetsByContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
  align-items: center;
  ${Label} {
    margin-right: 10px;
  }
  ${FilterOption} {
    margin-left: -20px;
  }
`;

export const AssetFilterDialogBox = styled.div<AssetFilterViewProps>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000000;
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${margins.medium};
  height: 100%;
  ${({ height }): string => `max-height: ${height}px;`};
  ${({ width }): string => `max-width: ${width}px;`};
  overflow: hidden;
`;

export const AssetFilterDialogTitle = styled.div`
  font-size: ${fontSize.small};
  font-weight: bold;
  margin-bottom: ${margins.small};
  :first-letter {
    text-transform: capitalize;
  }
`;

export const AssetFilterDialogSection = styled.div`
  display: flex;
  margin-bottom: ${margins.nano};
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${margins.small};
`;

export const AssetFilterDialogWrapper = styled.div`
  display: flex;
  overflow-y: scroll;
  flex-direction: column;
`;
export const AssetFilterDialogContainer = styled.div`
  margin-bottom: 40px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: ${margins.small};
`;

interface AssetFilterDialogToggleButtonProps {
  selected: boolean;
}

export const AssetFilterToggleButton = styled(SecondaryButton)<AssetFilterDialogToggleButtonProps>`
  padding: 8px 16px;
  font-size: ${fontSize.tiny};
  background-color: ${({ selected }) => (selected ? color.grey : "")};
  color: ${({ selected }) => (selected ? color.white : color.black)};
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  cursor: pointer;
  &:hover {
    background-color: ${({ selected }) => (selected ? color.grey : "")};
  }
  &:focus {
    outline: none;
  }
`;
