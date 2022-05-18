import { FC } from "react";

import { MainWrap, MainPageContainer } from "./styles";

interface MainContainerProps {
  children: React.ReactNode;
}

export const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return (
    <MainWrap>
      {/* TODO: Addd navigation */}
      <MainPageContainer>{children}</MainPageContainer>
    </MainWrap>
  );
};
