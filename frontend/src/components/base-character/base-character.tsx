import { FC } from "react";

import { CharacterItems } from "../../interfaces";
import { CharacterContainer, CharacterIcon, CharacterWrapper, ItemIcon } from "./styles";
import { useViewport } from "../../hooks";
import { ArmaCitizen, Empty, text } from "../../assets";
import { zIndex } from "../../design";

interface BaseCharacterProps {
  characterImage?: string;
  items?: CharacterItems;
  isZoomed?: boolean;
  size?: "mini" | "medium" | "half" | "normal" | "large" | "extraLarge";
  isClothing?: boolean;
}

export const BaseCharacter: FC<BaseCharacterProps> = ({ characterImage, items, isZoomed = false, size = "normal" }) => {
  const { width, height } = useViewport();

  return (
    <CharacterWrapper>
      <CharacterContainer width={width} height={height} isZoomed={isZoomed} size={size}>
        <CharacterIcon width={width} height={height} src={characterImage || ArmaCitizen} />
        <ItemIcon
          src={items?.hair?.image || Empty}
          alt={items?.hair?.name || text.character.hair}
          width={width}
          height={height}
          zIndex={zIndex.hair}
        />
        <ItemIcon
          src={items?.headPiece?.image || Empty}
          alt={items?.headPiece?.name || text.character.headPiece}
          width={width}
          height={height}
          zIndex={zIndex.headPiece}
        />
        <ItemIcon
          src={items?.perk1?.image || Empty}
          alt={items?.perk1?.name || text.character.perk1}
          width={width}
          height={height}
          zIndex={zIndex.noseline}
        />
        <ItemIcon
          src={items?.background?.image || Empty}
          alt={items?.background?.name || text.character.background}
          width={width}
          height={height}
          zIndex={zIndex.background}
        />
        <ItemIcon
          src={items?.mask?.image || Empty}
          alt={items?.mask?.name || text.character.mask}
          width={width}
          height={height}
          zIndex={zIndex.mask}
        />
        <ItemIcon
          src={items?.filter1?.image || Empty}
          alt={items?.filter1?.name || text.character.filter2}
          width={width}
          height={height}
          zIndex={zIndex.airReservoir}
        />
        <ItemIcon
          src={items?.filter2?.image || Empty}
          alt={items?.filter2?.name || text.character.filter1}
          width={width}
          height={height}
          zIndex={zIndex.liquid}
        />
        <ItemIcon
          src={items?.patch?.image || Empty}
          alt={items?.patch?.name || text.character.patch}
          width={width}
          height={height}
          zIndex={zIndex.midBackground}
        />
        <ItemIcon
          src={items?.perk2?.image || Empty}
          alt={items?.perk2?.name || text.character.perk2}
          width={width}
          height={height}
          zIndex={zIndex.frontMask}
        />
        <ItemIcon
          src={items?.garment?.image || Empty}
          alt={items?.garment?.name || text.character.garment}
          width={width}
          height={height}
          zIndex={zIndex.garment}
        />
      </CharacterContainer>
    </CharacterWrapper>
  );
};
