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
      if (category === "air resevoir" || category === "front mask") {
        return `
        transform: rotate(90deg);
        line-height: 125px;
        `;
      }
      else if (category === "noseline") {
        return `
        transform: rotate(90deg);
        line-height: 95px;
        `;
      }
      else {
        return `
        transform: rotate(90deg);
        line-height: 65px;
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
  // &:hover {
  //   ${Id} {
  //     color: ${color.black};
  //   }
  // }
`;
