import styled from "@emotion/styled";
import { ArrowUpRightIcon, ExclamationIcon, TickIcon, WarningIcon } from "../../assets";
import { Badge, ButtonText, CharacterImgs, Input, MenuItemName, PrimaryButton } from "../../components";
import { Spinner } from "../../components/content-loader/styles";

import { color, margins } from "../../design";

interface ViewProps {
  height: number;
  width: number;
}

export const DefaultImage = styled(CharacterImgs)<ViewProps>`
  margin-left: 140px;
  top: 0;
`;

export const Exclamation = styled(ExclamationIcon)`
  margin-right: 20px;
  margin-bottom: 10px;
`;

export const Tick = styled(TickIcon)`
  margin-right: 20px;
  margin-bottom: 10px;
`;
interface ActiveProps {
  active: boolean;
}

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

export const Warning = styled(WarningIcon)``;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;
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
  ${Warning} {
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
  ${Spinner} {
    padding-left: 13px;
    width: 12px;
    height: 16px;
    border: 2px solid ${color.white};
    border-top: 2px solid ${color.grey};
    margin-left: 3px;
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

export const Step = styled.div<ActiveProps>`
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
  ${({ active }): string => {
    return active
      ? `
      background: ${color.white};
        `
      : `
      background: ${color.lightGrey};
      `;
  }};
`;

export const Line = styled.div`
  width: 16px;
  border: 0.5px solid ${color.darkGrey};
  transform: rotate(90deg);
  margin: ${margins.small} 20px ${margins.small} 39px;
`;

export const NumberContainer = styled.div<ActiveProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  min-width: 32px;
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

export const TickContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: 1px solid ${color.black};
  ${Tick} {
    margin: 0px;
  }
  margin-bottom: ${margins.small};
`;

export const InfoContainer = styled.div`
  margin-top: ${margins.big};
  ${MenuItemName} {
    margin-top: ${margins.mini};
    margin-bottom: ${margins.medium};
  }
`;

export const GeneralInfo = styled.div<ActiveProps>`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
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
  ${({ active }): string => {
    return active
      ? `
      background: ${color.white};
        `
      : `
      background: ${color.lightGrey};
      `;
  }};
`;

export const PricingContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
  position: static;
`;
