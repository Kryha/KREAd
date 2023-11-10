import styled from "@emotion/styled";

import { TickIcon } from "../../assets";
import { DetailSectionColorPaletteWrap } from "../../containers/detail-section/detail-section-color-palette/styles";
import { color, fontWeight, margins } from "../../design";
import { BodyText, ButtonText, Input, SecondaryButton } from "../atoms";
import { Diamond } from "../price-in-ist/styles";

interface SelectProps {
  selected: boolean;
}

export const Tick = styled(TickIcon)``;

export const StyledSelect = styled.div<SelectProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
  margin: ${margins.small} 0px;
  cursor: pointer;
  :hover {
    ${ButtonText} {
      color: ${color.black};
    }
    ${Diamond} {
      background: ${color.black};
    }
  }
  ${Tick} {
    ${({ selected }) => !selected && "display: none"}
  }
  ${Diamond} {
    align-self: center;
    margin-left: -25px;
    background: ${({ selected }) => (selected ? color.black : color.grey)};
  }
`;

interface ViewProps {
  height: number;
}

export const SelectDivider = styled.div`
  border: 0.5px solid ${color.grey};
  width: 100%;
`;

export const ClearButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 16px;

  :hover {
    cursor: pointer;
    ${ButtonText} {
      color: ${color.black};
    }
  }
`;

export const SelectBox = styled.div<ViewProps>`
  width: 220px;
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${margins.medium};
  ${({ height }): string => `max-height: ${height - 250}px;`};
  overflow-y: scroll;
`;

export const ColorBox = styled(SelectBox)`
  width: 350px;
  overflow: hidden;
  z-index: 10000000;
`;

export const ColorContainer = styled.div`
  margin-bottom: 40px;
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: ${margins.small};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${margins.small};
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  width: 100%;
  ${SecondaryButton} {
    width: 40px;
  }
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
export const SliderContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
`;

export const SliderTrack = styled.div`
  height: 4px;
  position: absolute;
  background: ${color.grey};
  border-radius: 3px;
  width: 100%;
  z-index: 1;
`;
export const MaxInput = styled(Input)`
  width: 119px;
  padding: 3px 0 16px 33px;
  position: relative;
  font-weight: ${fontWeight.light};
`;

export const MinInput = styled(MaxInput)`
  margin-right: 40px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  margin-bottom: 38px;
`;

export const TextLabel = styled(BodyText)`
  display: flex;
  ::before {
    position: absolute;
    content: "IST";
    font-weight: ${fontWeight.light};
    font-size: 14px;
    line-height: 18px;
    padding-top: 3px;
    color: ${color.black};
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
`;

export const ColorWrapper = styled.div<SelectProps>`
  cursor: pointer;
  &:hover {
    ${DetailSectionColorPaletteWrap} {
      svg {
        border: 1px solid ${color.black};
      }
    }
  }
  ${({ selected }): string => {
    return selected
      ? `
      ${DetailSectionColorPaletteWrap} {
        svg {
          border: 1px solid ${color.black};
        }
      }
      `
      : `

      `;
  }};
`;
