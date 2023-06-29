import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";

export const useZoomCanvas = (
  stageRef: React.RefObject<Konva.Stage>,
  resetZoom: boolean,
  setResetZoom: { (value: React.SetStateAction<boolean>): void }
) => {
  const [scale, setScale] = useState(1);
  const prevScaleRef = useRef(1);
  const initialDistanceRef = useRef(0);
  const pinchStartedRef = useRef(false);
  const zoomSpeed = 0.1;
  const maxScale = 4; // Maximum scale limit (400%)

  const handleZoomIn = () => {
    const zoom = 1 + zoomSpeed;
    const newScale = prevScaleRef.current * zoom;

    if (newScale <= maxScale) {
      setScale(newScale);
      stageRef.current?.scale({ x: newScale, y: newScale });
      stageRef.current?.batchDraw();
    }
  };

  const handleZoomOut = () => {
    const zoom = 1 - zoomSpeed;
    const newScale = prevScaleRef.current * zoom;

    if (newScale >= 1) {
      setScale(newScale);
      stageRef.current?.scale({ x: newScale, y: newScale });
      stageRef.current?.batchDraw();
    }
  };

  const handleResetZoom = () => {
    setScale(1);
    prevScaleRef.current = 1;
    stageRef.current?.scale({ x: 1, y: 1 });
    stageRef.current?.position({ x: 0, y: 0 });
    stageRef.current?.batchDraw();
  };

  useEffect(() => {
    const handleWheel = (event: Konva.KonvaEventObject<WheelEvent>) => {
      event.evt.preventDefault();

      let delta = event.evt.deltaY > 0 ? -1 : 1;
      const zoom = 1 + zoomSpeed * delta;

      const newScale = prevScaleRef.current * zoom;

      setScale(newScale);
      stageRef.current?.scale({ x: newScale, y: newScale });

      stageRef.current?.batchDraw();
    };

    const handleTouchStart = (event: Konva.KonvaEventObject<TouchEvent>) => {
      if (event.evt.touches.length === 2) {
        event.evt.preventDefault();
        const touch1 = event.evt.touches[0];
        const touch2 = event.evt.touches[1];
        initialDistanceRef.current = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
        pinchStartedRef.current = true;
      }
    };

    const handleTouchMove = (event: Konva.KonvaEventObject<TouchEvent>) => {
      if (pinchStartedRef.current && event.evt.touches.length === 2) {
        event.evt.preventDefault();
        const touch1 = event.evt.touches[0];
        const touch2 = event.evt.touches[1];
        const distance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
        const zoom = distance / initialDistanceRef.current;
        setScale((prevScale) => prevScale * zoom);
      }
    };

    const handleTouchEnd = (event: Konva.KonvaEventObject<TouchEvent>) => {
      if (event.evt.touches.length < 2) {
        pinchStartedRef.current = false;
      }
    };

    stageRef.current?.on("wheel", handleWheel);
    stageRef.current?.on("touchstart", handleTouchStart);
    stageRef.current?.on("touchmove", handleTouchMove);
    stageRef.current?.on("touchend", handleTouchEnd);

    return () => {
      stageRef.current?.off("wheel", handleWheel);
      stageRef.current?.off("touchstart", handleTouchStart);
      stageRef.current?.off("touchmove", handleTouchMove);
      stageRef.current?.off("touchend", handleTouchEnd);
    };
  }, [stageRef]);

  useEffect(() => {
    if (resetZoom) {
      setScale(1);
      prevScaleRef.current = 1;

      stageRef.current?.scale({ x: 1, y: 1 });
      stageRef.current?.batchDraw();
      setResetZoom(false);
    }
  }, [resetZoom, stageRef]);

  useEffect(() => {
    prevScaleRef.current = scale;
  }, [scale]);

  return { scale, handleZoomIn, handleZoomOut, handleResetZoom };
};
