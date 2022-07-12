import styled from "@emotion/styled";
import { color, fontWeight } from "../../design";

interface DirectionProps {
  isRight: boolean;
  category: string;
}

export const Id = styled.h3<DirectionProps>`
  :first-letter {
    text-transform: capitalize;
  }
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.medium};
  font-size: 12px;
  white-space: nowrap;
  color: ${color.darkGrey};
  ${({ isRight, category }): string => {
    if (isRight) {
      if (category === "styleline") {
        return `
        transform: rotate(90deg);
        line-height: 100px;
        `;
      }
      else if (category === "add-ons") {
        return `
        transform: rotate(90deg);
        line-height: 90px;
        `;
      }
      else if (category === "filter II") {
        return `
        transform: rotate(90deg);
        line-height: 75px;
        `;
      }
      else if (category === "filter I") {
        return `
        transform: rotate(90deg);
        line-height: 70px;
        `;
      }
      else {
        return `
        transform: rotate(90deg);
        line-height: 60px;
        `;
      }

    } else {
      return `
      margin-right: 8px;
      transform: rotate(-90deg);
      `;
    }
  }}

`;

export const InfoContainer = styled.div`
  width: 15px;
  cursor: pointer;
`;
