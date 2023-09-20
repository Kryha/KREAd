import { Badge, ButtonText, CharacterImgs, Input, MenuItemName, PrimaryButton } from "../../components";
import styled from "@emotion/styled";
import { ArrowUpRightIcon, ExclamationIcon, TickIcon, WarningIcon } from "../../assets";
import { breakpoints, color, fontSize, margins } from "../../design";
import { Spinner } from "../../components/content-loader/styles";

interface ViewProps {
  height: number;
  width: number;
}

export const DefaultImage = styled(CharacterImgs)<ViewProps>``;

export const Exclamation = styled(ExclamationIcon)`
  margin-right: 20px;
  margin-bottom: 10px;
`;

export const Tick = styled(TickIcon)`
  position: relative;
  right: 44px;
  margin-right: 20px;
  height: 10px;
  width: 20px;
`;

interface ActiveProps {
  active: boolean;
}

export const FormCard = styled.div<ViewProps>`
  display: flex;
  flex-direction: column;
  padding: ${margins.medium};
  background: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  margin-top: ${margins.big};
  margin-bottom: ${margins.big};
  width: 550px;

  @media screen and (max-width: ${breakpoints.desktop}) {
    margin-left: auto;
    margin-right: auto;
  }

  @media screen and (max-width: ${breakpoints.mobile}) {
    margin: auto;
    height: 100%;
    border-radius: 0;
  }
`;

export const Warning = styled(WarningIcon)``;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 4px;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  margin-bottom: ${margins.big};
  position: relative;
  ${Input} {
    width: 100%;
    padding-right: 10px;
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
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  path {
    stroke: ${color.white};
  }
`;

export const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: ${margins.small};
  align-self: flex-end;
  justify-content: flex-end;
  :hover {
    ${ArrowUp} {
      path {
        stroke: ${color.black};
      }
    }
  }
  ${Spinner} {
    width: 16px;
    height: 16px;
    border: 2px solid ${color.white};
    border-top: 2px solid ${color.grey};
    margin-left: 3px;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

export const StepContainer = styled.div`
  margin-top: ${margins.big};
`;

export const StepText = styled(ButtonText)`
  font-size: ${fontSize.subTitle};
  line-height: 20.5px;
`;

export const StepWrapper = styled.div<ActiveProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${margins.mini};
  justify-content: space-between;
  padding: ${margins.small};
  border: 1px solid ${color.darkGrey};
  border-radius: 24px;
  ${StepText} {
    margin: 0 ${margins.small};
  }
  ${PrimaryButton} {
    margin-left: ${margins.small};
  }
  ${Badge} {
    background: transparent;
  }
  ${({ active }): string => {
    return active === true
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
    margin: 0;
    position: relative;
    right: 0;
    path {
      stroke: ${color.white};
    }
  }
`;

export const PreviousButtonContainer = styled.div`
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
    margin: 0;
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
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${margins.small};
  width: 100%;
  background: ${color.white};
  border: 1px solid ${color.darkGrey};
  border-radius: 24px;
  ${StepText} {
    margin: 0 ${margins.small};
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${margins.mini};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  align-items: flex-end;
  align-content: flex-end;
`;

export const Step = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
