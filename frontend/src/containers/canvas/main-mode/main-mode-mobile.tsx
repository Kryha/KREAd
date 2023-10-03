import React, { FC } from "react";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { MAIN_MODE } from "../../../constants";
import { CategoryCards } from "../category-cards/category-cards";
import styled from "@emotion/styled";
import { color } from "../../../design";

export const MainModeMobile: FC = () => {
  const { setInteractionMode } = useCharacterBuilder();
  setInteractionMode(MAIN_MODE);

  return (
    <CategoryWrapper>
      <CategoryContainer>
        <CategoryCards />
      </CategoryContainer>
    </CategoryWrapper>
  );
};

export const CategoryWrapper = styled.div`
  grid-area: bottom-pane;
  position: relative;
  width: 100%;
  height: 20vh;
  margin: 0;
  border-top: 1px solid ${color.grey};
`;
export const CategoryContainer = styled.div`
  flex-direction: row;
  height: fit-content;
  flex: none;
  padding: 0;
  border-radius: 0;
`;
