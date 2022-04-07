import React from "react";

import { MainWrap, MainPageContainer } from "./styles";

export const MainContainer = ({ children }) => {
  return (
    <MainWrap>
      {/* TODO: Addd navigation */}
      <MainPageContainer>{children}</MainPageContainer>
    </MainWrap>
  );
};
