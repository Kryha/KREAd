import styled from "styled-components";
import { Card, CardContent } from "@mui/material";
import { color, margins } from "../../design";
import { CharacterWrapper, ExpandButton } from "../base-character/styles";

export const Product = styled(Card)`
  && {
    width: 402px;
    background: ${color.white};
    border: 1px solid ${color.grey};
    box-sizing: border-box;
    border-radius: ${margins.medium};
    box-shadow: none;
    padding-top: 24px;
    border-radius: 24px;
    align-items: center;
    min-height: 485px;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 354px;
  height: 320px;
  box-sizing: border-box;
  border-radius: 24px;
  margin-bottom: 24px;
  position: relative;
  ${CharacterWrapper} {
    left: 20%;
    right: 0;
  }
  ${ExpandButton} {
    display: none;
  }
`;

export const Content = styled(CardContent)`
 && {
   padding: 0 24px 24px 24px;
 }
`;

export const TitleWrapper = styled.div`
  width: 354px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 54px;
`;

export const OwnedByContainer = styled.div`
  margin-top: 8px;
`;

export const Footer = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
