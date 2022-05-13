import { FC } from "react";

import { MainWrap, MainPageContainer } from "./styles";

export const MainContainer: FC = ({ children }) => {
  return (
    <MainWrap>
      {/* TODO: Addd navigation */}
      <MainPageContainer>{children}</MainPageContainer>
    </MainWrap>
  );
};
