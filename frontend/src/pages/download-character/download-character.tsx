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
  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  const [resetZoom, setResetZoom] = useState(false);
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomCanvas(stageRef, resetZoom, setResetZoom);
  Konva.hitOnDragEnabled = true;

  /* Set the maximum canvas size to 1200 x 1000 */
  const stageWidth = Math.min(width, 1000);
  const stageHeight = Math.min(height, 1200);
  const scaledWidth = stageWidth * scale;
  const scaledHeight = stageHeight * scale;

  useEffect(() => {
    const drawItem = (src: string, alt: string, drawWidth: number, drawHeight: number) => {
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

        layerRef.current?.add(konvaImage);
        layerRef.current?.batchDraw();
      };
    };

    const drawCharacter = async () => {
      layerRef.current?.destroyChildren();

      drawItem(items.background?.image || Empty, items.background?.name || text.character.background, scaledWidth, scaledHeight);
      drawItem(items.midBackground?.image || Empty, items.midBackground?.name || text.character.midBackground, scaledWidth, scaledHeight);
      drawItem(character?.image || TempetCharacter, character?.name || text.character.defaultCharacter, scaledWidth, scaledHeight);
      drawItem(items.hair?.image || Empty, items.hair?.name || text.character.hair, scaledWidth, scaledHeight);
      drawItem(items.mask?.image || Empty, items.mask?.name || text.character.mask, scaledWidth, scaledHeight);
      drawItem(items.noseline?.image || Empty, items.noseline?.name || text.character.noseline, scaledWidth, scaledHeight);
      drawItem(items.liquid?.image || Empty, items.liquid?.name || text.character.liquid, scaledWidth, scaledHeight);
      drawItem(items.frontMask?.image || Empty, items.frontMask?.name || text.character.frontMask, scaledWidth, scaledHeight);
      drawItem(items.airReservoir?.image || Empty, items.airReservoir?.name || text.character.airReservoir, scaledWidth, scaledHeight);
      drawItem(items.clothing?.image || Empty, items.clothing?.name || text.character.clothing, scaledWidth, scaledHeight);
      drawItem(items.headPiece?.image || Empty, items.headPiece?.name || text.character.headPiece, scaledWidth, scaledHeight);
    };

    drawCharacter();
  }, [character, items, width, height, scale]);

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownload = () => {
    const stage = stageRef.current!;
    if (stage) {
      stage.toImage({
        callback: (image) => {
          const imageURL = image.src;
          setCanvasImage(imageURL);
          downloadURI(imageURL, "character.png");
        },
        pixelRatio: 2,
      });
    }
  };

  if (isLoading) {
    return <LoadingPage spinner={false} />;
  }

  if (selectedCharacter) {
    return (
      <CanvasArea>
        <CanvasUserInterface
          stageRef={stageRef}
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          handleDownload={handleDownload}
        />
        <Stage width={width} height={height} ref={stageRef} draggable={true}>
          <Layer ref={layerRef} />
        </Stage>
      </CanvasArea>
    );
  }

  return <LoadingPage spinner={true} />;
};
