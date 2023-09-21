import React, { createContext, FC, useCallback, useMemo, useState } from "react";
import { useAndRequireContext, useAssembleCharacter, useViewport } from "../hooks";
import { text } from "../assets";
import { InteractionMode, MAIN_MODE } from "../constants";

interface Context {
  selectedAsset: string | null;
  setSelectedAsset: (asset: string | null) => void;
  selectedAssetCategory: string | null;
  setSelectedAssetCategory: (category: string | null) => void;
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  scale: number;
  setScale: (scale: number) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  onAssetChange: boolean;
  setOnAssetChange: (change: boolean) => void;
  onCategoryChange: boolean;
  setOnCategoryChange: (change: boolean) => void;
  showWarning: boolean;
  setShowWarning: (show: boolean) => void;
  showToast: boolean;
  setShowToast: (show: boolean) => void;
}

interface Props {
  children: React.ReactNode;
}

const ContextRef = createContext<Context | undefined>(undefined);

export const CharacterBuilderContextProvider: FC<Props> = ({ children }) => {
  const [selectedAssetCategory, setSelectedAssetCategory] = useState<string | null>(null);

  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [onCategoryChange, setOnCategoryChange] = useState<boolean>(true);
  const [onAssetChange, setOnAssetChange] = useState<boolean>(false);

  const [scale, setScale] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(MAIN_MODE);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const contextValue = useMemo(
    () => ({
      showToast,
      setShowToast,
      showWarning,
      setShowWarning,
      showDetails,
      setShowDetails,
      setScale,
      scale,
      position,
      setPosition,
      selectedAsset,
      setSelectedAsset,
      selectedAssetCategory,
      setSelectedAssetCategory,
      interactionMode,
      setInteractionMode,
      onCategoryChange,
      setOnCategoryChange,
      onAssetChange,
      setOnAssetChange,
    }),
    [
      showToast,
      showWarning,
      showDetails,
      scale,
      position,
      selectedAsset,
      selectedAssetCategory,
      interactionMode,
      onCategoryChange,
      onAssetChange,
    ],
  );

  return <ContextRef.Provider value={contextValue}>{children}</ContextRef.Provider>;
};

export function useCharacterBuilder() {
  const selectedAsset = useAndRequireContext(ContextRef, "selectedAsset", "CharacterBuilderProvider").selectedAsset;
  const setSelectedAsset = useAndRequireContext(ContextRef, "setSelectedAsset", "CharacterBuilderProvider").setSelectedAsset;
  const selectedAssetCategory = useAndRequireContext(ContextRef, "useCharacterBuilder", "CharacterBuilderProvider").selectedAssetCategory;
  const setSelectedAssetCategory = useAndRequireContext(
    ContextRef,
    "useCharacterBuilder",
    "CharacterBuilderProvider",
  ).setSelectedAssetCategory;
  const interactionMode = useAndRequireContext(ContextRef, "useCharacterBuilder", "CharacterBuilderProvider").interactionMode;
  const setInteractionMode = useAndRequireContext(ContextRef, "useCharacterBuilder", "CharacterBuilderProvider").setInteractionMode;
  const scale = useAndRequireContext(ContextRef, "useCharacterBuilder", "CharacterBuilderProvider").scale;
  const setScale = useAndRequireContext(ContextRef, "useCharacterBuilder", "CharacterBuilderProvider").setScale;
  const position = useAndRequireContext(ContextRef, "useCharacterBuilder", "CharacterBuilderProvider").position;
  const setPosition = useAndRequireContext(ContextRef, "useCharacterBuilder", "CharacterBuilderProvider").setPosition;
  const showDetails = useAndRequireContext(ContextRef, "showDetails", "CharacterBuilderProvider").showDetails;
  const setShowDetails = useAndRequireContext(ContextRef, "setShowDetails", "CharacterBuilderProvider").setShowDetails;
  const onAssetChange = useAndRequireContext(ContextRef, "onAssetChange", "CharacterBuilderProvider").onAssetChange;
  const setOnAssetChange = useAndRequireContext(ContextRef, "setOnAssetChange", "CharacterBuilderProvider").setOnAssetChange;
  const onCategoryChange = useAndRequireContext(ContextRef, "onCategoryChange", "CharacterBuilderProvider").onCategoryChange;
  const setOnCategoryChange = useAndRequireContext(ContextRef, "setOnCategoryChange", "CharacterBuilderProvider").setOnCategoryChange;
  const showWarning = useAndRequireContext(ContextRef, "showWarning, CharacterBuilderProvider").showWarning;
  const setShowWarning = useAndRequireContext(ContextRef, "showWarning, CharacterBuilderProvider").setShowWarning;
  const setShowToast = useAndRequireContext(ContextRef, "showToast, CharacterBuilderProvider").setShowToast;
  const showToast = useAndRequireContext(ContextRef, "showToast, CharacterBuilderProvider").showToast;

  return {
    showToast,
    setShowToast,
    showWarning,
    setShowWarning,
    selectedAsset,
    setSelectedAsset,
    selectedAssetCategory,
    setSelectedAssetCategory,
    interactionMode,
    setInteractionMode,
    position,
    setPosition,
    scale,
    setScale,
    showDetails,
    setShowDetails,
    onAssetChange,
    setOnAssetChange,
    onCategoryChange,
    setOnCategoryChange,
  };
}

const downloadOptions = [
  { label: "Original (PNG)", value: "original" },
  { label: "Large (PNG)", value: "large" },
];

export function useCharacterDownloader(initialDownloadSize = "original") {
  const { width, height } = useViewport();
  const assembledCharacter = useAssembleCharacter(width, height);
  const [downloadSize, setDownloadSize] = useState<string>(initialDownloadSize);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [characterName, setCharacterName] = useState<string>("");

  const download = useCallback(
    async (selected: string) => {
      setDownloadSize(selected);
      try {
        if (assembledCharacter) {
          const imageBlob = await new Promise<Blob>((resolve) => {
            assembledCharacter.toBlob({
              pixelRatio: selected === "original" ? 1 : 5,
              quality: 1,
              mimeType: "image/png",
              callback: (blob: Blob | PromiseLike<Blob>) => resolve(blob),
            });
          });

          const imageBlobUrl = URL.createObjectURL(imageBlob);
          setDownloadUrl(imageBlobUrl);
          setCharacterName(assembledCharacter.attrs.name);

          const link = document.createElement("a");
          link.href = imageBlobUrl;
          link.download = `${assembledCharacter.attrs.name}.png`;
          link.click();

          URL.revokeObjectURL(imageBlobUrl);
        }
      } catch (error) {
        console.error(text.error.downloadFailed, error);
      }
    },
    [assembledCharacter],
  );

  return {
    download,
    downloadUrl,
    downloadSize,
    downloadOptions,
    setDownloadSize,
    characterName,
  };
}