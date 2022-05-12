import { FC } from 'react'
import { FCProps } from "../../types";
import { MainWrap, MainPageContainer } from "./styles";

export const MainContainer: FC<FCProps> = ({ children }) => {
  return (
    <MainWrap>
      {/* TODO: Addd navigation */}
      <MainPageContainer>{children}</MainPageContainer>
    </MainWrap>
  );
};
