import styled from "@emotion/styled";
import { ArrowUpRightIcon } from "../../assets";
import { DetailSectionWrap } from "../../containers/detail-section/styles";

import { color, margins, zIndex } from "../../design";
import { HeaderHorizontalDivider, PrimaryButton } from "../atoms";
import { ButtonInfoWrap } from "../button-info/styles";
import { PriceContainer } from "../price-in-ist/styles";

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${margins.mini};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;

interface CharacterProps {
  width: number;
  height: number;
  showCard: boolean;
}

export const CharacterWrapper = styled.div<CharacterProps>`
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  box-shadow: none;
  right: ${margins.big};
  top: 101px;
  position: absolute;
  z-index: ${zIndex.onTop};
  ${({ width, height }): string =>
    `
      min-width: ${width * 0.375}px;
      max-width: ${width * 0.375}px;
      width: ${width * 0.375}px;
      max-height: ${height - 80}px;
   `};
`;

export const CharacterHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${margins.big} ${margins.big} ${margins.medium} ${margins.big};
`;

export const CharacterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0;
`;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const CharacterContent = styled.div`
  padding: 0 ${margins.big} 0px ${margins.medium};
`;

export const CharacterItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${margins.big} ${margins.medium} ${margins.big} ${margins.mini};
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  margin-left: ${margins.mini};
  path {
    stroke: ${color.white};
  }
`;

export const CardActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  justify-content: flex-end;
  margin-top: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
  box-shadow: none;
  ${PriceContainer} {
    margin-top: ${margins.mini};
    margin-right: ${margins.mini};
  }
  ${ButtonInfoWrap} {
    margin-right: ${margins.small};
  }
  ${PrimaryButton} {
    &:hover {
      ${ArrowUp} {
        path {
          stroke: ${color.black};
        }
      }
    }
  }
`;

export const CharacterCardWrapper = styled.div`
  ${DetailSectionWrap} {
    position: relative;
    z-index: ${zIndex.onTop};
    bottom: ${margins.big};
    left: ${margins.big};
  }
`;

export const EmptyViewContainer = styled.div`
  padding-top: ${margins.big};
  padding-left: ${margins.big};
`;
