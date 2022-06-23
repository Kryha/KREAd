import styled from "@emotion/styled";
import { ArrowUpRightIcon } from "../../assets";

import { color, margins } from "../../design";
import { Img } from "../atoms";

export const ErrorContainer = styled.div`
  margin-left: 40px;
  margin-top: 40px;
`;

export const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 28px;
  width: 680px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: ${margins.small};
`;

export const ErrorTitle = styled.h1`
  font-family: "aktiv-grotesk";
  font-weight: 500;
  font-size: 46px;
  line-height: 51px;
  color: #141414;
  :first-letter {
    text-transform: capitalize;
  }
`;

export const DescriptionTitle = styled.h2`
  font-family: "aktiv-grotesk";
  font-weight: 400;
  font-size: 24px;
  line-height: 31px;
  color: #141414;
  :first-letter {
    text-transform: capitalize;
  }
`;

export const ImageConatiner = styled.div`
  position: fixed;
  bottom: -5px;
  right: 40px;
`;

export const ErrorIcon = styled(Img)`
  width: 548px;
  height: 764px;
`;

export const ArrowBack = styled(ArrowUpRightIcon)`
  padding-left: 13px;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  padding-left: 13px;
  path {
    stroke: ${color.white};
  }
`;
