import styled from "styled-components";
import { Card, CardContent } from "@mui/material";
import { color, margins } from "../../design";
import { Img } from "../atoms";

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

interface ImageProps {
  category?: string;
}

/* eslint-disable indent */
export const ItemImage = styled(Img) <ImageProps>`
${({ category }): string => {
    switch (category) {
      case "hair":
        return "width: 1000px; height: 400px; margin-top: 110px;";
      case "head piece":
        return "width: 1200px; height: 1200px; margin-left: -240px; margin-top: -70px;";
      case "clothing":
        return "width: 600px; height: 600px; margin-left: -25px; margin-top: -290px;";
      case "mask":
        return "width: 1200px; height: 1200px; margin-left: -256px; margin-top: -406px;";
      case "noseline":
        return "width: 1500px; height: 1500px; margin-left: -350px; margin-top: -310px;";
      case "air resevoir":
        return "width: 900px; height: 900px; margin-left: -140px; margin-top: -300px;";
      case "liquid":
        return "width: 1200px; height: 1200px; margin-left: -250px; margin-top: -400px;";
      case "front mask":
        return "width: 1400px; height: 1400px; margin-left: -350px; margin-top: -600px;";
      default:
        return "width: 354px; height: 320px;";
    }
  }};
`;
