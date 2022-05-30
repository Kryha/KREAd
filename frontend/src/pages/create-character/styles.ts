import styled from "styled-components";
import { CloseIcon } from "../../assets";
import { HeaderHorizontalDivider, Img, MenuText } from "../../components";
import { color, margins } from "../../design";

interface ImageProps {
  hei: number;
  wid: number;
}

export const DefaultImage = styled(Img) <ImageProps>`
  margin-left: 140px;
  top: 0;
  ${({ wid, hei }): string => `min-width: ${wid * 0.4}px; max-width: ${wid * 0.4}px; width: ${wid * 0.4}px; height: ${hei}px;`};
`;

export const FormCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  width: 526px;
  height: 688px;
  background: ${color.gradientLight};
  border: 1px solid ${color.grey};
  border-radius: 24px;
  margin-top: 40px;
`;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;

export const Close = styled(CloseIcon)`
  width: ${margins.big};
  height: ${margins.big};
  cursor: pointer;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0px;
  ${MenuText} {
    margin-right: 60px;
  }
`;
