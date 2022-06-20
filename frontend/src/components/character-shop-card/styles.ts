import styled from "@emotion/styled";
import { color, margins } from "../../design";
import { CharacterWrapper, ExpandButton } from "../base-character/styles";

export const Product = styled.div`
  width: 402px;
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  box-shadow: none;
  padding-top: ${margins.medium};
  border-radius: ${margins.medium};
  align-items: center;
  min-height: 485px;
  :hover {
    border: 1px solid ${color.black};
  }
  cursor: pointer;
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 354px;
  height: 320px;
  box-sizing: border-box;
  border-radius: ${margins.medium};
  margin-bottom: ${margins.medium};
  position: relative;
  ${CharacterWrapper} {
    left: 20%;
    right: 0;
  }
  ${ExpandButton} {
    display: none;
  }
`;

export const Content = styled.div`
  padding: 0 ${margins.medium} ${margins.medium} ${margins.medium};
`;

export const TitleWrapper = styled.div`
  width: 354px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 54px;
`;

export const OwnedByContainer = styled.div`
  margin-top: ${margins.mini};
`;

export const Footer = styled.div`
  margin-top: ${margins.small};
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const Element = styled.div`
  width: 345px;
  height: 320px;
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  overflow: hidden;
`;
