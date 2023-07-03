import React, { createContext, FC, useMemo, useRef, useState } from "react";
import { useSelectedCharacter } from "../service";
import Konva from "konva";
import { useAndRequireContext } from "../hooks/use-and-require-context";
import { Empty, text } from "../assets";
import { LoadingPage } from "../components";

interface Context {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
  drawCharacter: () => Promise<Konva.Group>;
}

interface Props {
  children: React.ReactNode;
}

const ContextRef = createContext<Context | undefined>(undefined);

export const CharacterImageProvider: FC<Props> = ({ children }) => {
  const [selectedCharacter, isLoading] = useSelectedCharacter();

  const character = useMemo(() => selectedCharacter?.nft, [selectedCharacter]);
  const items = useMemo(() => selectedCharacter?.equippedItems || {}, [selectedCharacter]);

  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  Konva.hitOnDragEnabled = true;

  const drawCharacter = async (): Promise<Konva.Group> => {
    const loadImage = (src: string, alt: string): Promise<Konva.Image> => {
      return new Promise((resolve, reject) => {
        const imageObj = new window.Image();
        imageObj.src = src;
        imageObj.alt = alt;
        imageObj.crossOrigin = "anonymous"; // This enables CORS
        imageObj.onload = () => {
          const xOriginal = -imageObj.width / 2;
          const yOriginal = -imageObj.height / 2;

          const konvaImage = new Konva.Image({
            image: imageObj,
            x: xOriginal,
            y: yOriginal,
            width: imageObj.width,
            height: imageObj.height,
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
      { src: character?.image || Empty, alt: character?.name || text.character.defaultCharacter },
      { src: items.hair?.image || Empty, alt: items.hair?.name || text.character.hair },
      { src: items.mask?.image || Empty, alt: items.mask?.name || text.character.mask },
      { src: items.noseline?.image || Empty, alt: items.noseline?.name || text.character.noseline },
      { src: items.liquid?.image || Empty, alt: items.liquid?.name || text.character.liquid },
      { src: items.frontMask?.image || Empty, alt: items.frontMask?.name || text.character.frontMask },
      { src: items.airReservoir?.image || Empty, alt: items.airReservoir?.name || text.character.airReservoir },
      { src: items.clothing?.image || Empty, alt: items.clothing?.name || text.character.clothing },
      { src: items.headPiece?.image || Empty, alt: items.headPiece?.name || text.character.headPiece },
    ];

    const imageGroup = new Konva.Group({
      preventDefault: false,
      centeredScaling: true,
    });

    try {
      for (const { src, alt } of drawOrder) {
        const completedCharacter = await loadImage(src, alt);
        imageGroup.add(completedCharacter);
      }

      const boundingBox = imageGroup.getClientRect();
      const imageGroupWidth = boundingBox.width;
      const imageGroupHeight = boundingBox.height;

      imageGroup.setAttrs({
        width: imageGroupWidth,
        height: imageGroupHeight,
        x: boundingBox.x,
        y: boundingBox.y,
        name: character?.name || text.character.defaultCharacter,
      });
    } catch (error) {
      // Handle the error here
      console.error("An error occurred while loading and pushing images:", error);
    }

    return imageGroup;
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  const contextValue = useMemo(
    () => ({
      stageRef: stageRef,
      layerRef: layerRef,
      drawCharacter,
    }),
    [stageRef, layerRef, drawCharacter]
  );

  return <ContextRef.Provider value={contextValue}>{children}</ContextRef.Provider>;
};

export function useCharacterImage(): Context {
  return useAndRequireContext(ContextRef, "useCharacterImage", "CharacterImageProvider");
}

const downloadOptions = [
  { label: "Original (PNG)", value: "original" },
  { label: "Large (PNG)", value: "large" },
];
export function useCharacterDownloader(initialDownloadSize = "original") {
  const { drawCharacter } = useCharacterImage();
  const [downloadSize, setDownloadSize] = useState<string>(initialDownloadSize);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [characterName, setCharacterName] = useState<string>("");

  const download = async () => {
    try {
      const character = await drawCharacter();
      const dataUrl = character.toDataURL({
        pixelRatio: downloadSize === "original" ? 1 : 3,
        quality: 1,
        mimeType: "image/png",
      });
      setDownloadUrl(dataUrl);
      setCharacterName(character.attrs.name);
    } catch (error) {
      console.error(text.error.downloadFailed, error);
    }
  };

  return { download, downloadUrl, characterName, downloadOptions, setDownloadSize };
}
