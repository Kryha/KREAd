import styled from "@emotion/styled";
import { breakpoints, color } from "../../design";
import { CardElementIcon, DiagonalIcon, PlusIcon } from "../../assets";
import { StatsWrapper } from "../item-stats/styles";

export const Card = styled(CardElementIcon)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const PlusContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 24px;
  background-color: ${color.white};
  border: none;
`;

export const Diagonal = styled(DiagonalIcon)``;

export const DiagonalContainer = styled.div`
  background-color: ${color.white};
`;

export const ElementWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  min-width: 120px;
  overflow: hidden;
  cursor: pointer;

  @media screen and (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 100%;
    min-width: 0;
  }
`;

export const ElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px;
  width: 120px;
  height: 120px;
  box-sizing: border-box;
  border-radius: 24px;
  background-color: ${color.white};
  border: 1px solid ${color.grey};

  &:hover {
    background-color: ${color.lightGrey};
    border: 1px solid ${color.darkGrey};

    ${PlusContainer} {
      background-color: ${color.lightGrey};
    }
    ${DiagonalContainer} {
      background-color: ${color.lightGrey};
    }
  }

  @media screen and (max-width: ${breakpoints.tablet}) {
    padding: 0;
  }
`;

export const NoImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  //border-radius: 24px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
  z-index: 100;
`;

export const Plus = styled(PlusIcon)`
  width: 14px;
  height: 14px;
`;

export const ItemCardWrapper = styled.div`
  &:not(:hover) {
    ${StatsWrapper} {
      display: none;
    }
  }

  @media screen and (max-width: ${breakpoints.tablet}) {
    ${StatsWrapper} {
      display: none;
    }
  }
`;
