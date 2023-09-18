import React, { FC, useEffect, useMemo, useRef } from "react";
import Konva from "konva";
import { Layer, Stage } from "react-konva";
import { CanvasArea } from "./styles";
import { useAssembleCharacter, useIsMobile } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { ITEM_MODE, MAIN_MODE } from "../../../constants";
import { breakpoints } from "../../../design";

interface Props {
  width: number;
  height: number;
}

export const CharacterCanvas: FC<Props> = ({ width, height }) => {
  const layerRef = useRef<Konva.Layer | null>(null);
  const extendedCharacter = useAssembleCharacter(width, height);
  const { selectedAssetCategory, selectedAsset, interactionMode, showDetails, onAssetChange } = useCharacterBuilder();
  const isMobile = useIsMobile(breakpoints.tablet);

  const assembledCharacter = useMemo(() => extendedCharacter, [extendedCharacter]);

  //show or hide items based on interaction mode
  const handleItemVisibility = () => {
    const categories = assembledCharacter?.getChildren();

    categories?.forEach((category) => {
      if (category instanceof Konva.Group) {
        category.getChildren().forEach((item) => {
          if (interactionMode === MAIN_MODE) {
            if (item.getAttr("equipped")) {
              item.show();
            } else {
              item.hide();
            }
          }

          if (interactionMode === ITEM_MODE) {
            if (category.id() === selectedAssetCategory) {
              if (item.getAttr("equipped") && !onAssetChange) {
                item.show();
              }

              if (item.name() === selectedAsset) {
                item.show();
              } else {
                item.hide();
              }
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    if (assembledCharacter && layerRef.current) {
      layerRef.current.destroyChildren();
      layerRef.current.add(assembledCharacter);
      layerRef.current.batchDraw();
    }
  }, [assembledCharacter, layerRef]);

  useEffect(() => {
    handleItemVisibility();
  }, [assembledCharacter, selectedAsset, selectedAssetCategory, interactionMode, onAssetChange]);

  useEffect(() => {
    if (!showDetails) {
      assembledCharacter?.getChildren().forEach((category) => {
        category.to({
          opacity: 1,
          duration: 0.5,
        });
      });
    }

    if (interactionMode === ITEM_MODE && showDetails) {
      handleItemVisibility();
      assembledCharacter?.getChildren().forEach((category) => {
        if (category.id() !== selectedAssetCategory) {
          category.to({
            opacity: 0.05,
            duration: 0.5,
          });
        } else {
          category.to({
            opacity: 1,
            duration: 0.5,
          });
        }
      });
    }
  }, [selectedAssetCategory, showDetails, interactionMode]);

  useEffect(() => {
    if (!assembledCharacter) return;

    if (!isMobile) {
      const xPosition = interactionMode !== MAIN_MODE ? width / 4 : width / 2;
      assembledCharacter.to({
        x: xPosition,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [assembledCharacter, interactionMode, selectedAssetCategory, isMobile, width]);

  return (
    <CanvasArea>
      <Stage width={width} height={height}>
        <Layer ref={layerRef} />
      </Stage>
    </CanvasArea>
  );
};
