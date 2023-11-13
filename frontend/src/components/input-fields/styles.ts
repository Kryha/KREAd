import styled from "@emotion/styled";

import { RangeIcon, TickIcon } from "../../assets";
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
  margin-bottom: 40px;
  ${SecondaryButton} {
    width: 40px;
  }
`;

interface RangeProps {
  width?: number;
  left?: number;
}

export const SliderContainer = styled.div`
  position: relative;
  width: 278px;
`;

export const SliderTrack = styled.div`
  height: 1px;
  position: absolute;
  border-bottom: 1px solid ${color.grey};
  width: 100%;
  z-index: 1;
`;

export const SliderRange = styled.div<RangeProps>`
  border-radius: 0;
  height: 4px;
  width: ${(props): string => `${props.width}%;`};
  left: ${(props): string => `${props.left}%;`};
  position: absolute;
  background-color: ${color.black};
  z-index: 2;
`;

export const ThumbLeft = styled.input`
  -webkit-appearance: none;
  appearance: none;
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  pointer-events: none;
  position: absolute;
  height: 0;
  width: 278px;
  outline: none;
  ::-webkit-slider-thumb {
    cursor: pointer;
    height: 32px;
    width: 40px;
    margin-top: 4px;
    -webkit-appearance: none;
    appearance: none;
    border: 0;
    background: url(${RangeIcon});
    pointer-events: all;
    position: relative;
  }
  ::-moz-range-thumb {
    cursor: pointer;
    height: 32px;
    width: 40px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
    border: 0;
    background: url(${RangeIcon});
  }

  z-index: 3;
`;

export const ThumbRight = styled(ThumbLeft)`
  z-index: 4;
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
    font-family: aktiv-grotesk;
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
