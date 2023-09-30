import React, { FC, useEffect, useMemo, useRef } from "react";
import Konva from "konva";
import { CanvasArea } from "../../containers/canvas/character-canvas/styles";
import { Layer, Stage } from "react-konva";
import { useBaseCharacter } from "../../hooks/use-base-character";
import { Character, CharacterItems } from "../../interfaces";

interface Props {
  width: number;
  height: number;
  character: Character | undefined;
  items: CharacterItems;
}

export const BaseCharacterCanvas: FC<Props> = ({ width, height, items, character }) => {
  const layerRef = useRef<Konva.Layer | null>(null);
  const extendedCharacter = useBaseCharacter(width, height, character, items);
  const assembledCharacter = useMemo(() => extendedCharacter, [extendedCharacter]);

  useEffect(() => {
    if (assembledCharacter && layerRef.current) {
      layerRef.current.destroyChildren();
      layerRef.current.add(assembledCharacter);
      layerRef.current.batchDraw();
    }
  }, [assembledCharacter, layerRef]);

  return (
    <CanvasArea>
      <Stage width={width} height={height}>
        <Layer ref={layerRef} />
      </Stage>
    </CanvasArea>
  );
};
