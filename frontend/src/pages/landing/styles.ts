import styled from "@emotion/styled";
import { CloseIcon, DownArrowIcon } from "../../assets";
import { disappear, fadeIn } from "../../components/atoms/animations";
import { CharacterWrapper } from "../../components/base-character/styles";
import { color, margins } from "../../design";

interface ImageProps {
  isZoomed?: boolean;
}

export const LandingContainer = styled.div<ImageProps>`
  ${CharacterWrapper} {
    animation: ${fadeIn} 1.5s;
  }
`;

export const Menu = styled(DownArrowIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

export const Close = styled(CloseIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

export const BaseWrapper = styled.div``;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: ${margins.nano};
  margin-left: ${margins.big};
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.8s, 1s;
  animation-delay: 0s, 0.8s;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 12px;
`;

export const CharacterCardWrapper = styled.div`
  position: absolute;
  z-index: 10000;
  bottom: ${margins.big};
  left: 30px;
`;

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano} ${margins.mini};
  gap: 10px;

  position: absolute;
  width:  ${margins.small};
  height: ${margins.small};
  left: 27px;
  top: -3px;

  background: ${color.black};
  border-radius: ${margins.medium};
  z-index: 1000;
`;
