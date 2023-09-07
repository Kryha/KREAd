import React, { useEffect } from "react";
import { useViewport } from "../../hooks";
import { Layer, Stage } from "react-konva";
import { CanvasArea } from "./styles";
import { useCharacterImage } from "../../context/character-image-provider";
import Konva from "konva";
import { CanvasUserInterface } from "./canvas-user-interface";
import { text } from "../../assets";

export const DownloadCharacter = () => {
  const { width, height } = useViewport();
  const { stageRef, layerRef, drawCharacter } = useCharacterImage();

  const positionX = width / 2;
  const positionY = height / 2;

  useEffect(() => {
    layerRef.current?.destroyChildren();

    const drawImages = async () => {
      try {
        if (layerRef.current) {
          const character = await drawCharacter();
          const scaledCharacter = scaleCharacterToScreen(character, width, height, positionX, positionY);

          layerRef.current.add(scaledCharacter);
          layerRef.current.batchDraw();
        }
      } catch (error) {
        console.error(text.error.sorrySomethingWentWrong, error);
      }
    };

    drawImages();
  }, [drawCharacter, width, height, positionX, positionY, layerRef]);

  return (
    <CanvasArea>
      <CanvasUserInterface />
      <Stage ref={stageRef} width={width} height={height} draggable={true}>
        <Layer ref={layerRef} />
      </Stage>
    </CanvasArea>
  );
};

const scaleCharacterToScreen = (group: Konva.Group, width: number, height: number, x: number, y: number) => {
  const aspectRatio = group.height() / group.width();
  const stageAspectRatio = height / width;
  let newWidth = width;
  let newHeight = height;

  if (stageAspectRatio > aspectRatio) {
    newHeight = width * aspectRatio;
  } else {
    newWidth = height / aspectRatio;
  }

  const scaleX = newWidth / group.width();
  const scaleY = newHeight / group.height();

  group.setAttrs({
    scaleX: scaleX,
    scaleY: scaleY,
    x,
    y,
  });

  return group;
};
