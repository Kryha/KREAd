import styled from "styled-components";
import { Card, CardContent } from "@mui/material";
import { color, margins } from "../../design";

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
`;

export const CharacterImage = styled.img`
  width: 354px;
  height: 320px;
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
  align-items: space-between;
  justify-content: space-between;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
