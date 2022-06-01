import styled from "styled-components";
import { CloseIcon } from "../../assets";
import { margins } from "../../design";
import { HeaderHorizontalDivider, MenuText } from "../atoms";

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;

export const Close = styled(CloseIcon)`
  width: ${margins.big};
  height: ${margins.big};
  cursor: pointer;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0px;
  ${MenuText} {
    margin-right: 60px;
  }
`;

export const FormNavigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin-top: ${margins.big};
`;

export const NavigationTab = styled.div``;

export const ReturnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0px;
`;
