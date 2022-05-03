import styled from "styled-components";
import { color, margins } from "../../design";
import { MenuItemName } from "../atoms";

export const MenuItemWrapper = styled.div``;

export const Info = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  margin: 24px 0px;
`;

export const ImageCard = styled.div`
  background: ${color.gradientLight};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;

export const Img = styled.img`
  width: 80px;
  height: 80px;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  margin: 0px ${margins.medium};
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
   margin-right: ${margins.medium};
  ${MenuItemName} {
    margin-bottom: ${margins.nano};
  }
`;
