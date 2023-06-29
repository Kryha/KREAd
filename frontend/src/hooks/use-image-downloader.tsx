import { useEffect, useMemo, useState } from "react";
import Konva from "konva";
import { useSelectedCharacter } from "../service";
import { Empty, TempetCharacter, text } from "../assets";
import { LoadingPage } from "../components";

export const downloadOptions = [
  { label: "Original (PNG)", value: "original" },
  { label: "Medium (PNG)", value: "medium" },
  { label: "Large (PNG)", value: "large" },
];

export const downloadFormats = [{ label: "PNG", value: "png" }];

export const useImageDownloader = (initialDownloadSize = "original") => {
  const [selectedCharacter, isLoading] = useSelectedCharacter();

  const character = useMemo(() => selectedCharacter?.nft, [selectedCharacter]);
  const items = useMemo(() => selectedCharacter?.equippedItems || {}, [selectedCharacter]);
  const [downloadSize, setDownloadSize] = useState<string>(initialDownloadSize);
  const [downloadFormat, setDownloadFormat] = useState<string>(downloadFormats[0].value);
  const [pixelRatio, setPixelRatio] = useState<number>(1);

  useEffect(() => {
    if (downloadSize === "medium") {
      setPixelRatio(2);
    } else if (downloadSize === "large") {
      setPixelRatio(3);
    } else {
      setPixelRatio(1);
    }
  }, [downloadSize]);

  const drawCharacter = async () => {
    const loadImage = (src: string, alt: string) =>
      new Promise((resolve, reject) => {
        const imageObj = new window.Image();
        imageObj.src = src;
        imageObj.alt = alt;
        imageObj.crossOrigin = "anonymous"; // This enables CORS
        imageObj.onload = () => {
          const x = -imageObj.width / 2;
          const y = -imageObj.height / 2;
          const konvaImage = new Konva.Image({
            image: imageObj,
            x: x,
            y: y,
            preventDefault: false,
          });

          resolve(konvaImage);
        };

        imageObj.onerror = () => {
          reject(new Error(`Failed to load image: ${src}`));
        };
      });

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
      const completedCharacter = await loadImage(src, alt);
      drawnImages.push(completedCharacter as Konva.Image);
    }

    if (drawnImages.length > 0) {
      const imageGroup = new Konva.Group({
        preventDefault: false,
      });
      drawnImages.forEach((image) => imageGroup.add(image));

      if (isLoading) {
        return <LoadingPage spinner={true} />;
      }

      return imageGroup.toDataURL({
        pixelRatio: pixelRatio,
        quality: 1,
        mimeType: `image/${downloadFormat}`,
      });
    }
  };

  return { drawCharacter, downloadSize, setDownloadSize };
};
