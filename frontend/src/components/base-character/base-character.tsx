import { FC } from "react";

import { CharacterItems } from "../../interfaces";
import { CharacterContainer, CharacterIcon, CharacterWrapper, ItemIcon } from "./styles";
import { useViewport } from "../../hooks";
import { TempetCharacter, Empty, text } from "../../assets";
import { zIndex } from "../../design";

interface BaseCharacterProps {
  items: CharacterItems;
  isZoomed?: boolean;
  size?: "mini" | "medium" | "half" | "normal" | "large" | "extraLarge";
}

export const BaseCharacter: FC<BaseCharacterProps> = ({ items, isZoomed = false, size = "normal" }) => {
  const { width, height } = useViewport();

  return (
    <CharacterWrapper>
      <CharacterContainer width={width} height={height} isZoomed={isZoomed} size={size}>
        <CharacterIcon width={width} height={height} src={TempetCharacter} />
        <ItemIcon
          src={items.hair?.image || Empty}
          alt={items.hair?.name || text.character.hair}
          width={width}
          height={height}
          zIndex={zIndex.hair}
        />
        <ItemIcon
          src={items.headPiece?.image || Empty}
          alt={items.headPiece?.name || text.character.headPiece}
          width={width}
          height={height}
          zIndex={zIndex.headPiece}
        />
        <ItemIcon
          src={items.styleline?.image || Empty}
          alt={items.styleline?.name || text.character.styleline}
          width={width}
          height={height}
          zIndex={zIndex.styleline}
        />
        <ItemIcon
          src={items.background1?.image || Empty}
          alt={items.background1?.name || text.character.background}
          width={width}
          height={height}
          zIndex={zIndex.background}
        />
        <ItemIcon
          src={items.mask?.image || Empty}
          alt={items.mask?.name || text.character.mask}
          width={width}
          height={height}
          zIndex={zIndex.mask}
        />
        <ItemIcon
          src={items.filter1?.image || Empty}
          alt={items.filter1?.name || text.character.filter1}
          width={width}
          height={height}
          zIndex={zIndex.filter1}
        />
        <ItemIcon
          src={items.filter2?.image || Empty}
          alt={items.filter2?.name || text.character.filter2}
          width={width}
          height={height}
          zIndex={zIndex.filter2}
        />
        <ItemIcon
          src={items.background2?.image || Empty}
          alt={items.background2?.name || text.character.background2}
          width={width}
          height={height}
          zIndex={zIndex.backgroundTwo}
        />
        <ItemIcon
          src={items.addOns?.image || Empty}
          alt={items.addOns?.name || text.character.addOns}
          width={width}
          height={height}
          zIndex={zIndex.addOns}
        />
        <ItemIcon
          src={items.clothing?.image || Empty}
          alt={items.clothing?.name || text.character.clothing}
          width={width}
          height={height}
          zIndex={zIndex.clothing}
        />
      </CharacterContainer>
    </CharacterWrapper>
  );
};
