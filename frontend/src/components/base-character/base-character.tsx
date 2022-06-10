import { FC } from "react";

import { CharacterItems } from "../../interfaces";
import { CharacterContainer, CharacterIcon, CharacterWrapper, ExpandButton, ItemIcon } from "./styles";
import { useViewport } from "../../hooks";
import { CharacterBase, Empty, ExpandIcon, text } from "../../assets";
import { color, zIndex } from "../../design";
import { ButtonText } from "../atoms";

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
        <CharacterIcon width={width} height={height} src={CharacterBase} />
        <ItemIcon src={items.hair?.image || Empty} alt={items.hair?.name || text.character.hair} width={width} height={height} />
        <ItemIcon
          src={items.headPiece?.image || Empty}
          alt={items.headPiece?.name || text.character.headPiece}
          width={width}
          height={height}
        />
        <ItemIcon
          src={items.noseline?.image || Empty}
          alt={items.noseline?.name || text.character.noseline}
          width={width}
          height={height}
          zIndex={zIndex.onTop}
        />
        <ItemIcon
          src={items.midBackground?.image || Empty}
          alt={items.midBackground?.name || text.character.midBackground}
          width={width}
          height={height}
          zIndex={zIndex.backgroundTwo}
        />
        <ItemIcon src={items.mask?.image || Empty} alt={items.mask?.name || text.character.mask} width={width} height={height} />
        <ItemIcon
          src={items.frontMask?.image || Empty}
          alt={items.frontMask?.name || text.character.frontMask}
          width={width}
          height={height}
        />
        <ItemIcon src={items.liquid?.image || Empty} alt={items.liquid?.name || text.character.liquid} width={width} height={height} />
        <ItemIcon
          src={items.background?.image || Empty}
          alt={items.background?.name || text.character.background}
          width={width}
          height={height}
          zIndex={zIndex.background}
        />
        <ItemIcon
          src={items.airResevoir?.image || Empty}
          alt={items.airResevoir?.name || text.character.airResevoir}
          width={width}
          height={height}
        />
        <ItemIcon
          src={items.clothing?.image || Empty}
          alt={items.clothing?.name || text.character.clothing}
          width={width}
          height={height}
        />
      </CharacterContainer>
      {/* TODO: do something with expanding */}
      {size === "mini" ? (
        <></>
      ) : (
        <ExpandButton backgroundColor={color.white}>
          <ExpandIcon />
          <ButtonText>{text.general.showFull}</ButtonText>
        </ExpandButton>
      )}
    </CharacterWrapper>
  );
};
