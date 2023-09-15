import { FC } from "react";
import { LoadingIcon, LogoWrap } from "./styles";

interface LogoProps {
  iteration?: number;
}

export const AnimatedLoading: FC<LogoProps> = ({ iteration }) => {
  return (
    <LogoWrap iteration={iteration}>
      <LoadingIcon />
    </LogoWrap>
  );
};
