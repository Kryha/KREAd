import styled from "styled-components";
import { ArrowUpRightIcon, ExclamationIcon, TickIcon } from "../../assets";
import { Badge, ButtonText, Input, PrimaryButton } from "../../components";

import { color, margins } from "../../design";

interface ViewProps {
  height: number;
  width: number;
}

export const DefaultImage = styled.img<ViewProps>`
  margin-left: 140px;
  top: 0;
  ${({ width, height }): string => `min-width: ${width * 0.4}px; max-width: ${width * 0.4}px; width: ${width * 0.4}px; height: ${height}px;`};
`;

export const Exclamation = styled(ExclamationIcon)`
  margin-right: 20px;
  margin-bottom: 10px;
`;

export const Tick = styled(TickIcon)`
  margin-right: 20px;
  margin-bottom: 10px;
`;

export const FormCard = styled.div<ViewProps>`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${margins.big};
  background: ${color.gradientLight};
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  margin-top: ${margins.big};
  ${({ height, width }): string => `height: ${height - 80}px; width: ${width * 0.4}px; min-width: 526px;`};
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  margin-bottom: ${margins.big};
  position: relative;
  ${Input} {
    width: 100%;
    padding-right: 75px;
  }
  ${ButtonText} {
    margin-top: ${margins.mini};
  }
`;

export const ContentWrapper = styled.div`
  margin-top: ${margins.big};
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  padding-left: 13px;
  path {
    stroke: ${color.white};
  }
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: ${margins.big};
  right: ${margins.big};
  :hover {
    ${ArrowUp} {
      path {
        stroke: ${color.black};
      }
    }
  }
`;

export const InputWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 20px;
`;

export const StepContainer = styled.div`
  margin-top: ${margins.big};
`;

export const StepText = styled(ButtonText)`
  font-size: ${margins.small};
  line-height: 20.5px;
`;

export const Step = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${margins.medium};
  position: static;
  width: 100%;
  height: 88px;
  left: 0px;
  top: 0px;
  background: ${color.white};
  border: 1px solid ${color.darkGrey};
  border-radius: 24px;
  ${StepText} {
    margin: 0px ${margins.small};
  }
  ${PrimaryButton} {
    margin-left: ${margins.small};
  }
  ${Badge} {
    background: transparent;
  }
`;

export const Line = styled.div`
  width: 16px;
  border: 0.5px solid ${color.darkGrey};
  transform: rotate(90deg);
  margin: ${margins.small} 20px ${margins.small} 39px;
`;

interface NumberProps {
  active: boolean;
}

export const NumberContainer = styled.div<NumberProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  ${({ active }): string => {
    return active
      ? `
      background: ${color.black};
      ${ButtonText} {
        color: ${color.white};
      }
        `
      : `
      ${ButtonText} {
        color: ${color.black};
      }
      border: 1px solid ${color.grey};
      `;
  }};
  ${Tick} {
    margin: 0px;
    path {
      stroke: ${color.white};
    }
  }
`;

export const PreviousButtonContainer = styled.div`
  position: absolute;
  bottom: ${margins.big};
  :hover {
    ${ArrowUp} {
      path {
        stroke: ${color.black};
      }
    }
  }
`;
