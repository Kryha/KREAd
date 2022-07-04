import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { UNMOUNTED, EXITED, ENTERED, EXITING } from "../../constants";
import { useTimer } from "../../hooks/hooks";
import { FadeInOutWrapper } from "./styles";

interface FadeInOutProps {
  show: boolean;
  children: ReactNode;
}

export const FadeInOut: FC<FadeInOutProps> = ({ show, children }) => {
  const [state, setState] = useState({ status: UNMOUNTED });
  const [hide, setHide] = useTimer(0.6, state.status === EXITED);

  const statusChange = useCallback(() => {
    if(show === true) {
      setState({ status: ENTERED });
    }
    if(show === false && state.status === ENTERED) {
      setState({ status: EXITING });
    }
    if(state.status === EXITING) {
      setState({ status: EXITED });
    }
    if(hide) {
      setState({ status: UNMOUNTED });
      setHide(false);
    }
  },[hide, setHide, show, state.status]);

  useEffect(() => {
    statusChange();
  }, [statusChange]);

  if(state.status === UNMOUNTED && !show) return <></>;

  return (
    <FadeInOutWrapper entering={show} exiting={state.status === EXITED}>
      {children}
    </FadeInOutWrapper>
  );
};
