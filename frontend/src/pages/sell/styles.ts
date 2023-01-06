import styled from "@emotion/styled";
import { ArrowUpRightIcon, ExclamationIcon, TickIcon, WarningIcon } from "../../assets";
import { ButtonText, PrimaryButton, MenuItemName, Badge, FormText, Input, BodyText } from "../../components";
import { fadeUp } from "../../components/atoms/animations";
import { EquippedLabel } from "../../components/character-item/styles";
import { Spinner, LoadingPageContainer } from "../../components/content-loader/styles";
import { Info, ButtonContainer as Button, EquippedLabel as ItemLabel } from "../../components/menu-item/styles";
import { DetailSectionHeaderNavigationWrap } from "../../containers/detail-section/detail-section-header-navigation/styles";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { margins, color } from "../../design";
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
    margin: 0px;
  }
  margin-bottom: ${margins.small};
`;

export const ContentWrapper = styled.div`
  ${FormCard} {
    position: absolute;
    bottom: 40px;
    right: 40px;
    animation: ${fadeUp} 1.2s ease-out 0s forwards;
    opacity: 0;
    transform: translate3d(0, 1rem, 0);
  }
  ${DetailSectionWrap} {
    margin-top: 40px;
    position: absolute;
    bottom: 40px;
    left: 40px;
    height: 80vh;
  }
  ${DetailSectionHeaderNavigationWrap} {
    display: none;
  }
  ${FormText} {
    margin-top: ${margins.big};
  }
  ${TickContainer} {
    margin-top: ${margins.big};
  }
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
  border-radius: ${margins.medium};
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
  width: ${margins.small};
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
  padding: 0px;
  margin-bottom: ${margins.big};
  position: relative;

  margin-top: ${margins.big};
  ${Input} {
    padding-right: 75px;
    padding-left: 33px;
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
  ::before {
    position: absolute;
    content: "IST";
    font-family: "aktiv-grotesk";
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
  width: 100%;
  ${Input} {
    width: 100%;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
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
