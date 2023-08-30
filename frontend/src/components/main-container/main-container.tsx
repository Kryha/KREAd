import { FC } from "react";
import { useViewport } from "../../hooks";

import { MainWrap } from "./styles";

interface MainContainerProps {
  children: React.ReactNode;
}

export const MainContainer: FC<MainContainerProps> = ({ children }) => {
  const { height } = useViewport();
  return (
    <MainWrap height={height}>
      {children}
    </MainWrap>
  );
};
