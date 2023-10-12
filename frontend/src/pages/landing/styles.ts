import styled from "@emotion/styled";
import { CloseIcon, DownArrowIcon } from "../../assets";
import { disappear, fadeIn, SecondaryButton } from "../../components";
import { CharacterWrapper } from "../../components/base-character/styles";
import { color, margins } from "../../design";
import { DetailSectionWrap } from "../../containers/detail-section/styles";

interface ImageProps {
  isZoomed?: boolean;
}

export const LandingContainer = styled.div<ImageProps>`
  ${CharacterWrapper} {
    animation: ${fadeIn} 1.5s;
  }
`;

export const Menu = styled(DownArrowIcon)`
  margin: 0 0 0 11px !important;
  width: 12px;
`;

export const Close = styled(CloseIcon)`
  margin: 0 0 0 11px !important;
  width: 12px;
`;

export const BaseWrapper = styled.div``;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  z-index: 100;
  gap: ${margins.nano};
  margin-top: ${margins.medium};
  margin-right: ${margins.medium};
  margin-left: ${margins.medium};
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.8s, 1s;
  animation-delay: 0s, 0.8s;
  height: fit-content;

  background: transparent;

  ${SecondaryButton} {
    background: ${color.white};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  margin-top: 16px;
  gap: 12px;
`;

export const ItemCardWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  top: 24px;
  right: 24px;
  ${DetailSectionWrap} {
    height: 95vh;
    width: 500px;
  }
`;

export const CharacterCardWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano} ${margins.mini};
  gap: 10px;

  position: absolute;
  width: ${margins.small};
  height: ${margins.small};
  left: 27px;
  top: -3px;

  background: ${color.black};
  border-radius: ${margins.medium};
  z-index: 1000;
`;
