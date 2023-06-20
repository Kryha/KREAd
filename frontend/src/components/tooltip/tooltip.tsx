import React, { FC, useEffect, useState } from 'react';
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

  const showTip = () => setActive(true);

  const hideTip = () => setActive(false);

  const toggleTip = () => setActive(!active);

  useEffect(() => {
    const handleTouchStart = () => {
      setActive(true);
    };

    const handleTouchEnd = () => {
      setActive(false);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <TooltipWrap
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onClick={toggleTip}
      onBlur={hideTip}
    >
      {children}
      {active && (
        <TooltipContent className={position || "left"}>
          <h3>{title}</h3>
          <p>{content}</p>
        </TooltipContent>
      )}
    </TooltipWrap>
  );
};
