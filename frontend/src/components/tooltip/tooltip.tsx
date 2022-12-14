import React, { FC, useState } from "react";
import { InfoPosition } from "../../interfaces/layout.types";
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

  return (
    <TooltipWrap onMouseEnter={showTip} onMouseLeave={hideTip} onBlur={hideTip}>
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
