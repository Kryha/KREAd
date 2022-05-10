import { Box } from "@mui/material";
import styled from "styled-components";

interface ModalBoxProps {
  isItemCard: boolean;
};


export const ModalBox = styled(Box) <ModalBoxProps>`
  ${({ isItemCard }): string => {
    return isItemCard
      ? `
        top: 101px;
        position: absolute;
        right: 40px;
        `
      : `
        top: 101px;
        position: absolute;
        right: 40px;
      `;
  }}
`;
