import React, { useEffect, useMemo, useRef, useState } from "react";
import { useViewport } from "../../hooks";
import { Empty, TempetCharacter, text } from "../../assets";
import { Layer, Stage } from "react-konva";
import { useSelectedCharacter } from "../../service";
import { LoadingPage } from "../../components";
import Konva from "konva";
import { useZoomCanvas } from "../../hooks/use-zoom-canvas";
import { CanvasArea } from "./styles";
import { CanvasUserInterface } from "./canvas-user-interface";

export const DownloadCharacter = () => {
  const { width, height } = useViewport();
  const [selectedCharacter, isLoading] = useSelectedCharacter();

  const character = useMemo(() => selectedCharacter?.nft, [selectedCharacter]);
  const items = useMemo(() => selectedCharacter?.equippedItems || {}, [selectedCharacter]);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  const [resetZoom, setResetZoom] = useState(false);
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomCanvas(stageRef, resetZoom, setResetZoom);

  Konva.hitOnDragEnabled = true;

  /* Set the maximum canvas size to 800 x 1000 */
  const stageWidth = Math.min(width, 800);
  const stageHeight = Math.min(height, 1000);
  const scaledWidth = stageWidth * scale;
  const scaledHeight = stageHeight * scale;

  useEffect(() => {
    const drawCharacter = async () => {
      layerRef.current?.destroyChildren();

      const loadImage = (src: string, alt: string, drawWidth: number, drawHeight: number): Promise<Konva.Image> => {
        return new Promise((resolve, reject) => {
          const imageObj = new window.Image();
          imageObj.src = src;
          imageObj.crossOrigin = "anonymous"; // This enables CORS
          imageObj.onload = () => {
            const x = (width - drawWidth) / 2;
            const y = (height - drawHeight) / 2;
            const konvaImage = new Konva.Image({
              image: imageObj,
              x: x,
              y: y,
              width: drawWidth,
              height: drawHeight,
              preventDefault: false,
            });

            resolve(konvaImage);
          };

          imageObj.onerror = () => {
            reject(new Error(`Failed to load image: ${src}`));
          };
        });
      };

      const drawOrder = [
        { src: items.background?.image || Empty, alt: items.background?.name || text.character.background },
        { src: items.midBackground?.image || Empty, alt: items.midBackground?.name || text.character.midBackground },
        { src: character?.image || TempetCharacter, alt: character?.name || text.character.defaultCharacter },
        { src: items.hair?.image || Empty, alt: items.hair?.name || text.character.hair },
        { src: items.mask?.image || Empty, alt: items.mask?.name || text.character.mask },
        { src: items.noseline?.image || Empty, alt: items.noseline?.name || text.character.noseline },
        { src: items.liquid?.image || Empty, alt: items.liquid?.name || text.character.liquid },
        { src: items.frontMask?.image || Empty, alt: items.frontMask?.name || text.character.frontMask },
        { src: items.airReservoir?.image || Empty, alt: items.airReservoir?.name || text.character.airReservoir },
        { src: items.clothing?.image || Empty, alt: items.clothing?.name || text.character.clothing },
        { src: items.headPiece?.image || Empty, alt: items.headPiece?.name || text.character.headPiece },
      ];

      const drawnImages: Konva.Image[] = [];

      for (const { src, alt } of drawOrder) {
        const completedCharacter = await loadImage(src, alt, scaledWidth, scaledHeight);
        drawnImages.push(completedCharacter);
      }

      if (drawnImages.length > 0) {
        const imageGroup = new Konva.Group({
          preventDefault: false,
        });
        drawnImages.forEach((image) => imageGroup.add(image));

        imageGroup.setAttrs({
          width: scaledWidth,
          height: scaledHeight,
        });

        layerRef.current?.add(imageGroup);
        layerRef.current?.batchDraw();
      }
    };

    drawCharacter();
  }, [character, items, width, height, scale]);

  if (isLoading) {
    return <LoadingPage spinner={false} />;
  }

  if (selectedCharacter) {
    return (
      <CanvasArea>
        <CanvasUserInterface scale={scale} handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} handleResetZoom={handleResetZoom} />
        <Stage width={width} height={height} ref={stageRef} draggable={true}>
          <Layer ref={layerRef} />
        </Stage>
      </CanvasArea>
    );
  }

  return <LoadingPage spinner={true} />;
};
