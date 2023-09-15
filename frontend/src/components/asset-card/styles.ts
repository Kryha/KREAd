import styled from "@emotion/styled";

import { breakpoints, color, fontWeight, margins } from "../../design";
import { BoldLabel, disappear, fadeIn, Img, PrimaryButton } from "../atoms";
import { PriceContainer as Price } from "../price-in-ist/styles";

interface ImageProps {
  category?: string;
}

export const Line = styled.div`
  border: 0.5px solid ${color.darkGrey};
  transform: rotate(-90deg);
  width: 23px;
`;

export const OwnedByContainer = styled.div`
  margin-top: ${margins.mini};
`;
export const Element = styled.div`
  height: 320px;
  border-radius: ${margins.medium};
  overflow: hidden;
`;

export const AssetPriceContainer = styled.div`
  display: flex;
  margin-top: ${margins.small};
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

export const AssetWrapper = styled.div`
  position: relative;
  height: 100%;
  padding: ${margins.mini};
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.mini};
  align-items: center;
  cursor: pointer;

  ${Price} {
    align-items: center;
  }
  :hover {
    border: 1px solid ${color.black};
    ${PrimaryButton} {
      animation: ${disappear}, ${fadeIn};
      animation-duration: 0.3s, 0.3s;
      animation-delay: 0s, 0.3s;
    }
  }

  :not(:hover) {
    ${PrimaryButton} {
      opacity: 0;
    }
  }
`;

export const AssetContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
`;

export const AssetImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50%;
  box-sizing: border-box;
  margin-bottom: ${margins.medium};
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  position: relative;
`;

export const AssetImage = styled(Img)<ImageProps>`
  width: 100%;
  height: 100%;
`;
export const AssetInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const AssetTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  min-height: 54px;
  ${BoldLabel} {
    margin-top: ${margins.nano};
  }
`;

export const AssetTitleText = styled.h3`
  font-family: "aktiv-grotesk";
  font-weight: ${fontWeight.medium};
  font-size: 16px;
  line-height: 20px;
  :first-letter {
    text-transform: capitalize;
  }
  @media (max-width: ${breakpoints.mobile}) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 11px;
    max-width: 100%;
  }
`;

export const AssetFooter = styled.div`
  margin-top: ${margins.small};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 32px;
`;

export const AssetTag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const AssetTagPrice = styled.div`
  display: flex;
  margin-top: ${margins.small};
  flex-direction: row;
  ${BoldLabel} {
    font-size: 16px;
  }
`;

export const NoAssetImage = styled.div`
  border: 0.5px solid ${color.grey};
  transform: rotate(135deg);
  width: 126px;
  top: 38px;
  left: -20px;
`;
