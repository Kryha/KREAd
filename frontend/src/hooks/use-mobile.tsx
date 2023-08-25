import { useEffect, useState } from "react";

export const useIsMobile = (breakpoint: string): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const breakpointValue = parseInt(breakpoint, 10);
      const userAgent: string = window.navigator.userAgent;
      const mobileRegex: RegExp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice: boolean = mobileRegex.test(userAgent);
      const isSmallWidth: boolean = window.innerWidth <= breakpointValue;

      setIsMobile(isMobileDevice || isSmallWidth);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
};
