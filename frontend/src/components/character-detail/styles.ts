import styled from "styled-components";

import { CardElementIcon, CloseIcon } from "../../assets";
import { color, margins } from "../../design";
import { HeaderHorizontalDivider, HorizontalDivider } from "../atoms/lines";
import { Badge, Label, PrimaryButton } from "../atoms";
import { Card as CardIcon, ElementWrapper, ElementContainer as Element } from "../item-card/styles";

export const DetailWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  left: ${margins.big};
  bottom: ${margins.big};
  width: 720px;
  height: 604px;
  overflow-y: scroll;
`;

export const ElementContainer = styled(CardElementIcon)`
  width: 720px;
  height: 604px;
  overflow: hidden;
`;

export const Content = styled.div`
  padding: 0px ${margins.small};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
`;

export const SubTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  margin-top: ${margins.small};
  ${Badge} {
    margin-right: ${margins.mini};
    color: ${color.darkGrey};
    ::first-letter {
      text-transform: capitalize;
    }
  }
`;

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;

export const Close = styled(CloseIcon)`
  width: 12px;
  height: 12px;
  align-items: center;
  margin-top: ${margins.small}px;
  cursor: pointer;
`;

export const Detail = styled.div`
  width: 720px;
  background: ${color.lightGrey};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  box-shadow: none;
  max-height: 604px;
  overflow-y: scroll;
`;

export const DetailHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${margins.big} ${margins.big} ${margins.medium} ${margins.big};
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  ${PrimaryButton} {
    margin-right: ${margins.mini};
  }
`;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const DetailContent = styled.div`
  padding: ${margins.medium} ${margins.medium} 0px ${margins.medium};
  ${HorizontalDivider}{
    margin-bottom: ${margins.medium};
  }
`;

export const DetailItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${margins.big} ${margins.medium} ${margins.big} ${margins.mini};
`;

export const CardActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: ${margins.large};
  margin-right: ${margins.large};
  box-shadow: none;
`;

export const StoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
`;

export const SignContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  margin-right: 80px;
  ${Label} {
    margin-bottom: ${margins.small};
  }
  ${CardIcon} {
    width: 140px;
    height: 140px;
  }
  ${ElementWrapper} {
    width: 140px;
    height: 140px;
    background: ${color.lightGrey};
  }
  ${Element} {
     width: 140px;
    height: 140px;
    background: ${color.lightGrey};
    justify-content: center;
  }
`;
