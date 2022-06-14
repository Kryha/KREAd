import styled from "@emotion/styled";
import { color } from "../../design";
import { CardElementIcon } from "../../assets";

export const Card = styled(CardElementIcon)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const ElementWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    ${Card} {
      > rect {
        stroke: ${color.black};
      }
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
