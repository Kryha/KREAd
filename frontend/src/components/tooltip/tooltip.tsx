import { TooltipContent, TooltipWrap } from "./styles";
import { InfoPosition } from "../../interfaces";
import { FC, useRef, useState } from "react";
import { useClickAwayListener } from "../../hooks/use-click-away-listener";

interface TooltipProps {
  title?: string;
  position?: InfoPosition;
  content: string;
  children: React.ReactNode;
}

export const Tooltip: FC<TooltipProps> = ({ title, position, content, children }) => {
  const [active, setActive] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTip = () => setActive(true);
  const hideTip = () => setActive(false);

  useClickAwayListener(tooltipRef, active, hideTip);

  return (
    <TooltipWrap onMouseEnter={showTip} onMouseLeave={hideTip} onClick={showTip} onBlur={hideTip}>
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
