import React, { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { useCharacterImage } from "../context/character-image-provider";

const zoomProps = {
  initialScaleState: 1,
  zoomSpeed: 0.1,
  maxScale: 4,
};
export const useZoomCanvas = () => {
  const { stageRef } = useCharacterImage();
  const [scale, setScale] = useState(zoomProps.initialScaleState);
  const [zoomRelativeToPointer, setZoomRelativeToPointer] = useState(false);
  const [resetZoom, setResetZoom] = useState(false);

  const prevScaleRef = useRef(zoomProps.initialScaleState);
  const initialDistanceRef = useRef(0);
  const pinchStartedRef = useRef(false);
  const lastCenterRef = useRef({ x: 0, y: 0 });
  const lastDistRef = useRef(0);

  const handleZoom = useCallback(
    (zoom: number) => {
      const newScale = Math.round(prevScaleRef.current * zoom * 10) * zoomProps.zoomSpeed;

      const stage = stageRef.current?.getStage();

      if (stage) {
        const stageCenter = { x: stage.width() / 2, y: stage.height() / 2 };
        if (newScale <= zoomProps.maxScale && newScale >= 1) {
          setScale(newScale);
          stage.scale({ x: newScale, y: newScale });

          const newPos = {
            x: stage.x() + (stageCenter.x - stage.x()) * (1 - newScale / prevScaleRef.current),
            y: stage.y() + (stageCenter.y - stage.y()) * (1 - newScale / prevScaleRef.current),
          };

          stage.position(newPos);
          stage.batchDraw();
        }
      }
    },
    [stageRef],
  );

  const handleZoomIn = () => {
    const zoom = 1 + zoomProps.zoomSpeed;
    handleZoom(zoom);
  };

  const handleZoomOut = () => {
    const zoom = 1 - zoomProps.zoomSpeed;
    handleZoom(zoom);
  };

  const toggleZoomRelativeToPointer = () => {
    setZoomRelativeToPointer((prevValue) => !prevValue);
  };

  const handleResetZoom = () => {
    setScale(1);
    setResetZoom(true);
    prevScaleRef.current = 1;
    stageRef.current?.scale({ x: 1, y: 1 });
    stageRef.current?.position({ x: 0, y: 0 });
    stageRef.current?.batchDraw();
  };

  useEffect(() => {
    const stage = stageRef.current?.getStage();
    if (stage) {
      const stageCenter = { x: stage.width() / 2, y: stage.height() / 2 };
      const centeredStagePosition = (newScale: number) => {
        const x = stage.x() + (stageCenter.x - stage.x()) * (1 - newScale / prevScaleRef.current);
        const y = stage.y() + (stageCenter.y - stage.y()) * (1 - newScale / prevScaleRef.current);
        return { x, y };
      };

      const handleWheel = (event: Konva.KonvaEventObject<WheelEvent>) => {
        event.evt.preventDefault();
        const delta = event.evt.deltaY > 0 ? -1 : 1;
        const zoom = delta > 0 ? 1 + zoomProps.zoomSpeed : 1 - zoomProps.zoomSpeed;
        const newScale = Math.round(prevScaleRef.current * zoom * 10) * zoomProps.zoomSpeed;
        if (newScale <= zoomProps.maxScale && newScale >= 1) {
          setScale(newScale);
          const pointerPos = stage.getPointerPosition();
          if (zoomRelativeToPointer && pointerPos) {
            const pointerRelativePos = {
              x: pointerPos.x / stage.width(),
              y: pointerPos.y / stage.height(),
            };

            const newCenteredStagePosition = {
              x:
                stage.x() - (pointerRelativePos.x * newScale * stage.width() - pointerRelativePos.x * prevScaleRef.current * stage.width()),
              y:
                stage.y() -
                (pointerRelativePos.y * newScale * stage.height() - pointerRelativePos.y * prevScaleRef.current * stage.height()),
            };

            stage.position(newCenteredStagePosition);
          } else {
            const newCenteredStagePosition = centeredStagePosition(newScale);
            stage.position(newCenteredStagePosition);
          }

          stage.scale({ x: newScale, y: newScale });
          stage.batchDraw();
        }
      };

      const handleTouchStart = (event: Konva.KonvaEventObject<TouchEvent>) => {
        if (event.evt.touches.length === 2) {
          event.evt.preventDefault();
          const touch1 = event.evt.touches[0];
          const touch2 = event.evt.touches[1];
          initialDistanceRef.current = getDistance(touch1, touch2);
          pinchStartedRef.current = true;
        }
      };

      const handleTouchMove = (event: Konva.KonvaEventObject<TouchEvent>) => {
        if (pinchStartedRef.current && event.evt.touches.length === 2) {
          event.evt.preventDefault();
          const touch1 = event.evt.touches[0];
          const touch2 = event.evt.touches[1];
          const distance = getDistance(touch1, touch2);

          const zoom = Math.pow(distance / initialDistanceRef.current, zoomProps.zoomSpeed / 10);
          const newScale = prevScaleRef.current * zoom;

          if (stage.isDragging()) {
            stage.stopDrag();
          }

          if (newScale <= zoomProps.maxScale && newScale >= 1) {
            const newPos = centeredStagePosition(newScale);
            setScale(newScale);
            stage.scale({ x: newScale, y: newScale });
            stage.position(newPos);
            stage.batchDraw();
          }
        }
      };

      const handleTouchEnd = (event: Konva.KonvaEventObject<TouchEvent>) => {
        if (event.evt.touches.length < 2) {
          pinchStartedRef.current = false;
          lastCenterRef.current = { x: 0, y: 0 };
          lastDistRef.current = 0;
        }
      };

      stage.on("wheel", handleWheel);
      stage.on("touchstart", handleTouchStart);
      stage.on("touchmove", handleTouchMove);
      stage.on("touchend", handleTouchEnd);

      return () => {
        stage.off("wheel", handleWheel);
        stage.off("touchstart", handleTouchStart);
        stage.off("touchmove", handleTouchMove);
        stage.off("touchend", handleTouchEnd);
      };
    }
  }, [stageRef]);

  useEffect(() => {
    prevScaleRef.current = scale;

    if (resetZoom) {
      setScale(1);
      prevScaleRef.current = 1;
      stageRef.current?.scale({ x: 1, y: 1 });
      stageRef.current?.position({ x: 0, y: 0 });
      stageRef.current?.batchDraw();
      setResetZoom(false);
    }
  }, [scale, resetZoom, stageRef]);

  return { scale, handleZoomIn, handleZoomOut, handleResetZoom, toggleZoomRelativeToPointer };
};

const getDistance = (touch1: Touch, touch2: Touch) => {
  return Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2));
};
