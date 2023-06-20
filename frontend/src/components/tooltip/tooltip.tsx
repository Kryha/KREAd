import React, { FC, useEffect, useRef, useState } from 'react';
import { InfoPosition } from '../../interfaces';
import { TooltipContent, TooltipWrap } from "./styles";

interface TooltipProps {
  title?: string;
  position?: InfoPosition;
  content: string;
  children: React.ReactNode;
}

// TODO: Fix position so it doesn't get covered by parent container
// TODO: Make it smart so that if the viewport is smaller it finds a better position to pop
export const Tooltip: FC<TooltipProps> = ({ title, position, content, children }) => {
  const [active, setActive] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTip = () => setActive(true);
  const hideTip = () => setActive(false);

  const clickAwayListener = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      hideTip();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', clickAwayListener);

    return () => {
      document.removeEventListener('mousedown', clickAwayListener);
    };
  }, []);

  return (
    <TooltipWrap
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onClick={showTip}
      onBlur={hideTip}
    >
      {children}
      {active && (
        <TooltipContent ref={tooltipRef} className={position || "left"}>
          <h3>{title}</h3>
          <p>{content}</p>
        </TooltipContent>
      )}
    </TooltipWrap>
  );
};
