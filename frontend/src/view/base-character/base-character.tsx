import React, { FC } from 'react';

import { CharacterIcon, CharacterWrapper, ExpandButton, ItemIcon } from "./styles";
import { Character } from "@agoric/types";
import { useViewport } from "../../hooks";
import { CharacterBase, Empty, ExpandIcon, text } from "../../assets";
import { zIndex } from "../../design";
import { findEquipped } from "../../util";

interface BaseCharacterProps {
  character: Character;
  isZoomed: boolean;
  size?: "mini" | "medium" | "normal";
};

export const BaseCharacter: FC<BaseCharacterProps> = ({ character, isZoomed, size = "normal" }) => {
  const { width, height } = useViewport();

  return (
    <CharacterWrapper width={width} height={height} isZoomed={isZoomed} size={size}>
      <CharacterIcon width={width} height={height} src={CharacterBase} />
      <ItemIcon src={findEquipped(character.items.hair)?.image || Empty} alt={findEquipped(character.items.hair)?.name || text.character.hair} width={width} height={height} />
      <ItemIcon src={findEquipped(character.items.headPiece)?.image || Empty} alt={findEquipped(character.items.headPiece)?.name || text.character.headPiece} width={width} height={height} />
      <ItemIcon src={findEquipped(character.items.noseline)?.image || Empty} alt={findEquipped(character.items.noseline)?.name || text.character.noseline} width={width} height={height} zIndex={zIndex.onTop} />
      <ItemIcon src={findEquipped(character.items.midBackground)?.image || Empty} alt={findEquipped(character.items.midBackground)?.name || text.character.midBackground} width={width} height={height} zIndex={zIndex.backgroundTwo} />
      <ItemIcon src={findEquipped(character.items.mask)?.image || Empty} alt={findEquipped(character.items.mask)?.name || text.character.mask} width={width} height={height} />
      <ItemIcon src={findEquipped(character.items.frontMask)?.image || Empty} alt={findEquipped(character.items.frontMask)?.name || text.character.frontMask} width={width} height={height} />
      <ItemIcon src={findEquipped(character.items.liquid)?.image || Empty} alt={findEquipped(character.items.liquid)?.name || text.character.liquid} width={width} height={height} />
      <ItemIcon src={findEquipped(character.items.background)?.image || Empty} alt={findEquipped(character.items.background)?.name || text.character.background} width={width} height={height} zIndex={zIndex.background} />
      <ItemIcon src={findEquipped(character.items.airResevoir)?.image || Empty} alt={findEquipped(character.items.airResevoir)?.name || text.character.airResevoir} width={width} height={height} />
      <ItemIcon src={findEquipped(character.items.clothing)?.image || Empty} alt={findEquipped(character.items.clothing)?.name || text.character.clothing} width={width} height={height} />
      {/* TODO: do something with expanding */}
      <ExpandButton><ExpandIcon />{text.general.showFull}</ExpandButton>
    </CharacterWrapper>
  );
};
