import styled from "@emotion/styled";
import { Img, PrimaryButton } from "../../components";
import { ArrowUp } from "../buy/styles";
import { color } from "../../design";

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0;
  gap: 16px;
  ${PrimaryButton} {
    ${ArrowUp} {
      path {
        stroke: ${color.white};
      }
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MainIcon = styled(Img)`
  object-fit: contain;
  width: 100%;
  height: 100%;
  margin: auto;
  max-width: 300px;
`;
