
import { FC } from 'react';
import { Character } from "@agoric/types";

import { ImageCard, Info, InfoContainer, InfoWrapper, CharacterItemWrapper } from "./styles";
import { Badge, Label, MenuItemName } from "../atoms";
import { text } from "../../assets/text";
import { BaseCharacter } from "../base-character";



interface CharacterItemProps {
  character: Character;
};

export const CharacterItem: FC<CharacterItemProps> = ({ character }) => {
  return (
    <CharacterItemWrapper>
      <>
        <Info>
          <ImageCard>
            <BaseCharacter character={character} isZoomed={false} size="mini" />
          </ImageCard>
          <InfoWrapper>
            <InfoContainer>
              <MenuItemName>{character.name}</MenuItemName>
              <Label>{text.param.itemId(character.id)}</Label>
            </InfoContainer>
            {Boolean(character.equipped) && (
              <Badge>
                <Label>{text.general.equipped}</Label>
              </Badge>
            )}
          </InfoWrapper>
        </Info>
      </>
    </CharacterItemWrapper>
  );
}
