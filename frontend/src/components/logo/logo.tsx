import { FC } from "react";
import { KreadIcon, LogoWrap } from "./styles";

interface LogoProps {
  iteration?: number;
}

export const AnimatedLogo: FC<LogoProps> = ({ iteration }) => {
  return (
    <LogoWrap iteration={iteration}>
      <KreadIcon />
    </LogoWrap>
  );
};
