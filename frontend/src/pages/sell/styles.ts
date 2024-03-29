import styled from "@emotion/styled";
import { ArrowUpRightIcon, ExclamationIcon, TickIcon, WarningIcon } from "../../assets";
import { Badge, BodyText, ButtonText, fadeUp, Input, MenuItemName, PrimaryButton } from "../../components";
import { EquippedLabel } from "../../components/character-item/styles";
import { LoadingPageContainer, Spinner } from "../../components/content-loader/styles";
import { EquippedLabel as ItemLabel, Info } from "../../components/menu-item/styles";
import { color, fontWeight, margins } from "../../design";
import { FormCard } from "../create-character/styles";

interface ActiveProps {
  active: boolean;
}

export const Exclamation = styled(ExclamationIcon)`
  margin-right: 20px;
  margin-bottom: 10px;
`;

export const Tick = styled(TickIcon)`
  margin-right: 20px;
  margin-bottom: 10px;
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

export const ContentWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;

  ${FormCard} {
    animation: ${fadeUp} 1.2s ease-out 0s forwards;
    opacity: 0;
    width: 100%;
    transform: translate3d(0, 1rem, 0);
  }
`;

export const Header = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;
export const ArrowUp = styled(ArrowUpRightIcon)`
  path {
    stroke: ${color.white};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: auto;
  flex-direction: row;
  justify-content: flex-end;
  :hover {
    ${ArrowUp} {
      path {
        stroke: ${color.black};
      }
    }
  }
  ${LoadingPageContainer} {
    width: 35px;
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  ${Tick} {
    margin-top: 10px;
    margin-bottom: 0;
  }
`;

export const StepContainer = styled.div`
  margin-top: ${margins.small};
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
  height: 82px;
  left: 0;
  top: 0;
  background: ${color.white};
  border: 1px solid ${color.darkGrey};
  border-radius: ${margins.medium};
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

export const Line = styled.div`
  width: ${margins.mini};
  border: 0.5px solid ${color.darkGrey};
  transform: rotate(90deg);
  margin: ${margins.mini} 20px ${margins.mini} 39px;
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
    path {
      stroke: ${color.white};
    }
  }
`;

export const PreviousButtonContainer = styled.div`
  bottom: ${margins.big};
  :hover {
    ${ArrowUp} {
      path {
        stroke: ${color.black};
      }
    }
  }
`;

export const InfoContainer = styled.div`
  margin-top: ${margins.big};
  ${MenuItemName} {
    margin-top: ${margins.mini};
    margin-bottom: ${margins.medium};
  }
`;

export const Warning = styled(WarningIcon)``;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  margin-bottom: ${margins.big};
  position: relative;

  margin-top: ${margins.big};
  ${Input} {
    width: 100%;
    padding-right: 10px;
    padding-bottom: 4px;
  }
  ${ButtonText} {
    margin-top: ${margins.mini};
  }
  ${Warning} {
    margin-top: ${margins.mini};
  }
`;

export const TextLabel = styled(BodyText)`
  display: flex;
  width: 100%;
  // ::before {
  //   position: absolute;
  //   content: "IST";
  //   font-weight: 400;
  //   font-size: 14px;
  //   line-height: 18px;
  //   padding-top: 3px;
  //   color: ${color.black};
  // }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 8px;
  width: 100%;
  ${Input} {
    width: 100%;
    font-size: 24px;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 4px;
`;

export const CardContainer = styled.div`
  ${ItemLabel} {
    display: none;
  }
  ${EquippedLabel} {
    display: none;
  }
  ${Info} {
    cursor: default;
  }
`;

export const DetailContainer = styled.div``;

export const GeneralInfo = styled.div<ActiveProps>`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
  padding: ${margins.medium};
  position: static;
  width: 100%;
  height: 82px;
  left: 0;
  top: 0;
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
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
  position: static;
`;

export const AssetName = styled.h3`
  font-weight: ${fontWeight.medium};
  font-size: 14px;
  line-height: 15px;
`;

export const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
