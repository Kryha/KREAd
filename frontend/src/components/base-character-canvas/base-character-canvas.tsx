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
    const onMouseEnter = () => {
      assembledCharacter?.to({
        node: assembledCharacter,
        duration: 1,
        scaleX: 2,
        scaleY: 2,
        easing: Konva.Easings.EaseInOut,
      });
      document.body.style.cursor = "pointer";
    };

    const onMouseLeave = () => {
      assembledCharacter?.to({
        node: assembledCharacter,
        duration: 0.5,
        scaleX: 1.4,
        scaleY: 1.4,
        easing: Konva.Easings.EaseInOut,
      });
      document.body.style.cursor = "default";
    };

    if (assembledCharacter && layerRef.current) {
      layerRef.current.destroyChildren();
      layerRef.current.add(assembledCharacter);

      assembledCharacter.on("mouseenter", onMouseEnter);
      assembledCharacter.on("mouseleave", onMouseLeave);

      layerRef.current.batchDraw();
    }

    // Cleanup: Remove event listeners when component unmounts
    return () => {
      if (assembledCharacter) {
        assembledCharacter.off("mouseenter", onMouseEnter);
        assembledCharacter.off("mouseleave", onMouseLeave);
      }
    };
  }, [assembledCharacter, layerRef]);

  return (
    <CanvasArea>
      <Stage width={width} height={height}>
        <Layer ref={layerRef} />
      </Stage>
    </CanvasArea>
  );
};
