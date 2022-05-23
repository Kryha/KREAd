import React, { FC, useState } from "react";
import { TooltipContent, TooltipWrap } from "./styles";

interface TooltipProps {
  title: string;
  position?: ["top", "bottom", "left", "right"];
  content: string;
  children: React.ReactNode;
}

// TODO: Fix position so it doesn't get covered by parent container
export const Tooltip: FC<TooltipProps> = ({ title, position, content, children }) => {
  let timeout: number;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, 400) as unknown as number;
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <TooltipWrap onMouseEnter={showTip} onMouseLeave={hideTip}>
      {children}
      {active && (
        <TooltipContent className={`${position || "right"}`}>
          <h3>{title}</h3>
          <p>{content}</p>
        </TooltipContent>
      )}
    </TooltipWrap>
  );
};
