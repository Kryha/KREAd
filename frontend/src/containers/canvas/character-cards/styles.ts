import styled from "@emotion/styled";
import { breakpoints, color, fontWeight, margins } from "../../../design";
import { disappear, fadeIn } from "../../../components";
import { AssetTag } from "../../../components/asset-card/styles";

interface StyleProps {
  height: number;
  isSelected?: boolean;
}

export const CharacterButtonContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;
export const CharacterInfoCharacter = styled.span`
  :first-letter {
    text-transform: capitalize;
  }
  font-weight: ${fontWeight.medium};
  font-size: 12px;
  white-space: nowrap;
  color: ${color.darkGrey};
`;
export const CharacterInfo = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  flex: 1 1 auto;
  gap: 8px;

  ${AssetTag} {
    flex: 0;
  }
`;
export const CharacterCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${margins.small};

  @media screen and (max-width: ${breakpoints.tablet}) {
    padding: 8px;
    margin: 0;
  }
`;

export const CharacterCardsWrapper = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  gap: 16px;
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 320}px;`};
  ::-webkit-scrollbar {
    display: none;
  }
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.6s, 0.8s;
  animation-delay: 0s, 0.6s;
`;

interface CharacterProps {
  isSelected?: boolean;
}

export const CharacterCardContainer = styled.div<CharacterProps>`
  display: flex;
  transition: transform 0.3s ease; /* Add CSS transition for smooth animation */
  border-radius: ${margins.medium};
  border: 1px solid ${color.grey};
  ${({ isSelected }): string => (isSelected ? `background: whitesmoke; border: 1px solid ${color.black} ` : "background: white")};
  :hover {
    border: 1px solid ${color.black};
  }
`;
