import { FC } from "react";

import { CharacterItems } from "../../interfaces";
import { CharacterContainer, CharacterIcon, CharacterWrapper, ItemIcon } from "./styles";
import { useViewport } from "../../hooks";
import { TempetCharacter, Empty, text } from "../../assets";
import { zIndex } from "../../design";

interface BaseCharacterProps {
  characterImage?: string;
  items: CharacterItems;
  isZoomed?: boolean;
  size?: "mini" | "medium" | "half" | "normal" | "large" | "extraLarge";
}

export const BaseCharacter: FC<BaseCharacterProps> = ({ characterImage, items, isZoomed = false, size = "normal" }) => {
  const { width, height } = useViewport();

  return (
    <CharacterWrapper>
      <CharacterContainer width={width} height={height} isZoomed={isZoomed} size={size}>
        <CharacterIcon width={width} height={height} src={characterImage || TempetCharacter} />
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
          src={items.noseline?.image || Empty}
          alt={items.noseline?.name || text.character.noseline}
          width={width}
          height={height}
          zIndex={zIndex.noseline}
        />
        <ItemIcon
          src={items.background?.image || Empty}
          alt={items.background?.name || text.character.background}
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
          src={items.airReservoir?.image || Empty}
          alt={items.airReservoir?.name || text.character.airReservoir}
          width={width}
          height={height}
          zIndex={zIndex.airReservoir}
        />
        <ItemIcon
          src={items.liquid?.image || Empty}
          alt={items.liquid?.name || text.character.liquid}
          width={width}
          height={height}
          zIndex={zIndex.liquid}
        />
        <ItemIcon
          src={items.midBackground?.image || Empty}
          alt={items.midBackground?.name || text.character.midBackground}
          width={width}
          height={height}
          zIndex={zIndex.midBackground}
        />
        <ItemIcon
          src={items.frontMask?.image || Empty}
          alt={items.frontMask?.name || text.character.frontMask}
          width={width}
          height={height}
          zIndex={zIndex.frontMask}
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
