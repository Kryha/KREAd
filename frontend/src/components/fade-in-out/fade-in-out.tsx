import { FC, ReactNode, useState } from "react";
import { UNMOUNTED } from "../../constants";
import { FadeInOutWrapper } from "./styles";

interface FadeInOutProps {
  show?: boolean;
  children: ReactNode;
  exiting?: boolean;
}

export const FadeInOut: FC<FadeInOutProps> = ({ show, children, exiting }) => {
  const [state, _setState] = useState({ status: UNMOUNTED });

  if (state.status === UNMOUNTED && !show) return <></>;

  return (
    <FadeInOutWrapper entering={show} exiting={exiting}>
      {children}
    </FadeInOutWrapper>
  );
};
