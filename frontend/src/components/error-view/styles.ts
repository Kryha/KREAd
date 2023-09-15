import styled from "@emotion/styled";
import { ArrowUpRightIcon } from "../../assets";

import { color, margins } from "../../design";
import { Img, PrimaryButton } from "../atoms";
import { KreadIcon } from "../logo/styles";

export const ErrorContainer = styled.div`
  margin-left: 40px;
  margin-top: 102px;
`;

export const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 680px;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  padding-left: 13px;
  path {
    stroke: ${color.white};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 40px;
  gap: ${margins.small};
  ${PrimaryButton} {
    &:hover {
      ${ArrowUp} {
        path {
          stroke: ${color.black};
        }
      }
    }
  }
`;

export const ErrorTitle = styled.h1`
  font-family: "aktiv-grotesk";
  font-weight: 500;
  font-size: 46px;
  line-height: 51px;
  color: ${color.black};
  :first-letter {
    text-transform: capitalize;
  }
`;

export const DescriptionTitle = styled.h2`
  font-family: "aktiv-grotesk";
  font-weight: 400;
  font-size: 24px;
  line-height: 31px;
  color: ${color.black};
  :first-letter {
    text-transform: capitalize;
  }
  padding-top: 28px;
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

export const KreadContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  ${KreadIcon} {
    width: 100px;
    height: 24px;
    text-align: center;
    flex: 1;
    background: ${color.white};
  }
`;

export const KreadDevelopmentContainer = styled.div`
  flex: 0;
  display: flex;
  justify-items: center;
  align-items: center;
`;
