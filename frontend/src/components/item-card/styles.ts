import styled from "@emotion/styled";
import { color } from "../../design";
import { CardElementIcon, PlusIcon } from "../../assets";

export const Card = styled(CardElementIcon)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const PlusContainer = styled.div`
  position: absolute;
  left: 30.77%;
  right: 30.77%;
  top: 34%;
  bottom: 34%;
  z-index: 1;
  border-radius: 24px;
  background-color: ${color.white};
  border: none;
`;

export const ElementWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    ${PlusContainer} {
      background-color: ${color.lightGrey};
    }
    ${Card} {
      > rect {
        stroke: ${color.black};
      }
      fill: ${color.lightGrey};
    }
  }
`;

export const ElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  width: 120px;
  height: 120px;
  left: 23px;
  top: 0px;
  box-sizing: border-box;
  border-radius: 24px;
  background-color: ${color.white};
  z-index: 100;
`;

export const NoImage = styled.div`
  width: 104px;
  height: 100px;
  left: 8px;
  top: 10px;
  border-radius: 24px;
  position: relative;
`;

export const Diagonal = styled.div`
  border: 0.5px solid ${color.grey};
  transform: rotate(135deg);
  width: 126px;
  top: 38px;
  position: absolute;
  left: -20px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const Plus = styled(PlusIcon)`
  margin: 0px 0px 10px 0px;
  width: 14px;
  height: 14px;
`;
