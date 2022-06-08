import styled from "styled-components";

import { TickIcon, RangeIcon } from "../../assets";
import { DetailSectionColorPaletteWrap } from "../../containers/detail-section/detail-section-color-palette/styles";
import { color, margins } from "../../design";
import { ButtonText, SecondaryButton, BodyText, Input } from "../atoms";

interface SelectProps {
  selected: boolean;
}

export const Tick = styled(TickIcon)``;

export const StyledSelect = styled.div<SelectProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px;
  margin: ${margins.small} 0px;
  cursor: pointer;
  :hover {
    ${ButtonText} {
      color: ${color.black};
    }
  }
  ${({ selected }): string => {
    return selected
      ? ""
      : `
      ${Tick} {
        display: none;
      }
      `;
  }};
`;

export const SelectBox = styled.div`
  width: 180px;
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${margins.medium};
`;

export const ColorBox = styled(SelectBox)`
  width: 326px;
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
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
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
  border-radius: 0px;
  height: 4px;
  width: ${(props): string => `${props.width}%;`}
  left: ${(props): string => `${props.left}%;`}
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
  padding: 3px 0px 16px 33px;
  position: relative;
  font-family: aktiv-grotesk;
  font-weight: 400;
`;

export const MinInput = styled(MaxInput)`
  margin-right: 40px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  margin-bottom: 38px;
`;

export const TextLabel = styled(BodyText)`
  display: flex;
  ::before {
    position: absolute;
    content: "RUN";
    font-family: aktiv-grotesk;
    font-weight: 400;
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
  padding: 0px;
`;

export const ColorWrapper = styled.div<SelectProps>`
  cursor: pointer;
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
