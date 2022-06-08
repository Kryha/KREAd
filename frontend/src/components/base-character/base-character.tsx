import React, { FC } from "react";

import { Character } from "../../interfaces";
import { CharacterContainer, CharacterIcon, CharacterWrapper, ExpandButton, ItemIcon } from "./styles";
import { useViewport } from "../../hooks";
import { CharacterBase, Empty, ExpandIcon, text } from "../../assets";
import { color, zIndex } from "../../design";
import { ButtonText } from "../atoms";

interface BaseCharacterProps {
  character: Character;
  isZoomed: boolean;
  size?: "mini" | "medium" | "normal" | "large" | "extraLarge";
}

export const BaseCharacter: FC<BaseCharacterProps> = ({ character, isZoomed, size = "normal" }) => {
  const { width, height } = useViewport();

  return (
    <CharacterWrapper>
      <CharacterContainer width={width} height={height} isZoomed={isZoomed} size={size}>
        <CharacterIcon width={width} height={height} src={CharacterBase} />
        <ItemIcon
          src={character.items.hair?.image || Empty}
          alt={character.items.hair?.name || text.character.hair}
          width={width} height={height}
        />
        <ItemIcon
          src={character.items.headPiece?.image || Empty}
          alt={character.items.headPiece?.name || text.character.headPiece}
          width={width}
          height={height}
        />
        <ItemIcon
          src={character.items.noseline?.image || Empty}
          alt={character.items.noseline?.name || text.character.noseline}
          width={width}
          height={height}
          zIndex={zIndex.onTop}
        />
        <ItemIcon
          src={character.items.midBackground?.image || Empty}
          alt={character.items.midBackground?.name || text.character.midBackground}
          width={width}
          height={height}
          zIndex={zIndex.backgroundTwo}
        />
        <ItemIcon
          src={character.items.mask?.image || Empty}
          alt={character.items.mask?.name || text.character.mask}
          width={width}
          height={height}
        />
        <ItemIcon
          src={character.items.frontMask?.image || Empty}
          alt={character.items.frontMask?.name || text.character.frontMask}
          width={width}
          height={height}
        />
        <ItemIcon
          src={character.items.liquid?.image || Empty}
          alt={character.items.liquid?.name || text.character.liquid}
          width={width}
          height={height}
        />
        <ItemIcon
          src={character.items.background?.image || Empty}
          alt={character.items.background?.name || text.character.background}
          width={width}
          height={height}
          zIndex={zIndex.background}
        />
        <ItemIcon
          src={character.items.airResevoir?.image || Empty}
          alt={character.items.airResevoir?.name || text.character.airResevoir}
          width={width}
          height={height}
        />
        <ItemIcon
          src={character.items.clothing?.image || Empty}
          alt={character.items.clothing?.name || text.character.clothing}
          width={width}
          height={height} />
      </CharacterContainer>
      {/* TODO: do something with expanding */}
      {Boolean(size === "mini" || size === "large") && (
        <ExpandButton backgroundColor={color.white}
        ><ExpandIcon />
          <ButtonText>{text.general.showFull}</ButtonText>
        </ExpandButton>
      )}
    </CharacterWrapper>
  );
};
