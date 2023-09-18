import React, { useEffect, useMemo, useState } from "react";
import { useSelectedCharacter } from "../../../service";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { LoadingPage, PageTitle } from "../../../components";
import { PreviousIcon, text } from "../../../assets";
import { CATEGORY_MODE, CHARACTER_SELECT_MODE, ITEM_MODE, MAIN_MODE } from "../../../constants";
import { breakpoints } from "../../../design";
import { useIsMobile } from "../../../hooks";
import { ModeAnimationContainer, ModeButton, ModeScrollerContainer } from "./style";

export const ModeScroller: React.FC = () => {
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const items = useMemo(() => selectedCharacter?.equippedItems || {}, [selectedCharacter]);
  const {
    selectedAssetCategory,
    setSelectedAssetCategory,
    setSelectedAsset,
    onAssetChange,
    setShowWarning,
    interactionMode,
    setInteractionMode,
  } = useCharacterBuilder();
  const categories = Object.keys(items);
  const initialIndex = categories.findIndex((category) => category === selectedAssetCategory);
  const [currentIndex] = useState(initialIndex);
  const isMobile = useIsMobile(breakpoints.tablet);

  if (isLoading) {
    // Handle loading state if needed
    return <LoadingPage />;
  }

  if (!selectedCharacter?.equippedItems) {
    // Handle the case when selectedCharacter is null (e.g., no character selected)
    return <></>;
  }

  const handlePreviousMode = () => {
    if (interactionMode === CHARACTER_SELECT_MODE) {
      setInteractionMode(MAIN_MODE);
    }

    if (interactionMode === CATEGORY_MODE) {
      setSelectedAssetCategory(null);
      setSelectedAsset(null);
      setInteractionMode(MAIN_MODE);
    }

    if (interactionMode === ITEM_MODE) {
      if (!onAssetChange) {
        isMobile ? setInteractionMode(MAIN_MODE) : setInteractionMode(CATEGORY_MODE);
      } else {
        setShowWarning(true);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || "Escape") {
      handlePreviousMode();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  const pageTitle = () => {
    switch (interactionMode) {
      case ITEM_MODE:
        return text.param.categories[categories[currentIndex]] as string;
      case CATEGORY_MODE:
        return text.general.categories;
      case CHARACTER_SELECT_MODE:
        return text.navigation.myCharacters;
      default:
        return ""; // Provide a default value or handle other modes here.
    }
  };

  return (
    <ModeScrollerContainer>
      <ModeButton onClick={handlePreviousMode}>
        <PreviousIcon />
      </ModeButton>
      <ModeAnimationContainer>
        <PageTitle>{pageTitle()}</PageTitle>
      </ModeAnimationContainer>
    </ModeScrollerContainer>
  );
};
