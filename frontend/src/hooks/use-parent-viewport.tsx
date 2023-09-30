import { useEffect, useRef, useState } from "react";

export const useParentViewport = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    const updateParentViewport = () => {
      if (parentRef.current) {
        const { width, height } = parentRef.current.getBoundingClientRect();
        setParentWidth(width);
        setParentHeight(height);
      }
    };

    updateParentViewport();

    const resizeObserver = new ResizeObserver(updateParentViewport);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { parentRef, parentWidth, parentHeight };
};
