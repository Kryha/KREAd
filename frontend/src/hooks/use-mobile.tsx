import { useEffect, useState } from "react";
import { useViewport } from "./use-viewport";
import { breakpoints } from "../design";

export const useMobile = () => {

  const { width} = useViewport();
  const [mobile, setMobile] = useState<boolean>(false);

  useEffect(() => {

    const breakpointValue = parseInt(breakpoints.tablet, 10);
    (width <= breakpointValue) ? setMobile(true) : setMobile(false);

  }, [width, breakpoints.tablet])

  return mobile;
}
