import styled from "styled-components";
import { color } from "../../design";

export const ElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  width: 120px;
  height: 120px;
  left: 23px;
  top: 0px;
  background: #F0F0F0;
  border: 1px solid #D0D0D0;
  box-sizing: border-box;
  border-radius: 24px;
`;

export const Image = styled.img`
  width: 104px;
  height: 100px;
  left: 8px;
  top: 10px;
  border-radius: 24px;
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
  border: 1px solid ${color.grey};
  transform: rotate(135deg);
  width: 120px;
  top: 40px;
  position: absolute;
  left: -17px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
