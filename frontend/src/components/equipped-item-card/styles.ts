import styled from "@emotion/styled";
import { color } from "../../design";
import { Id } from "../vertical-info/styles";
import { ButtonText } from "../atoms";

interface DirectionProps {
  isRight: boolean;
  isSecond?: boolean;
}

export const EquippedContainer = styled.div<DirectionProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  &:hover {
    ${Id} {
      color: ${color.black};
    }
  }
`;

export const ItemCount = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -8px;
  right: -8px;
  font-size: 12px;
  border-radius: 50%;
  border: 1px solid ${color.grey};
  width: 26px;
  height: 26px;
  z-index: 1000;
  background-color: ${color.grey};
  ${ButtonText} {
    font-size: 12px;
  }
`;
