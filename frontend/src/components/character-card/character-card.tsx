import { FC, useCallback, useState } from "react";

import { ArrowUpRightIcon, text } from "../../assets";
import {
  CardActionsContainer,
  CharacterWrapper,
  CharacterContent,
} from "./styles";
import { ButtonText, OutlinedButton } from "../atoms";
import { CharacterItem } from "../character-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { CharacterDetail } from "../character-detail";
import { Character } from "../../interfaces";
interface CharacterCardProps {
  id: string;
  characters: Character[];
}

export const CharacterCard: FC<CharacterCardProps> = ({ id, characters }) => {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [character, setCharacter] = useState<Character>();

  const moveArrayItem = useCallback(
    () => {
      const allItems = [...characters];
      const fromIndex = characters.findIndex((character) => character.characterId === id);
      allItems.splice(0, 0, ...allItems.splice(fromIndex, 1));
      return allItems;
    }, [characters, id]);

  const showInfo = (values: Character) => {
    setShowDetail(!showDetail);
    setCharacter(values);
  };

  const showCharacterDetail = () => {
    setShowDetail(!showDetail);
  };

  const sortedCharacters = moveArrayItem();

  return (
    <>
      <CharacterWrapper>
        <>
          <CharacterContent>
            {sortedCharacters.map((character, index) => (
              <CharacterItem character={character} key={index} onClick={showInfo} id={id} />
            ))}
          </CharacterContent>
          <CardActionsContainer>
            <OutlinedButton type="submit" onClick={() => navigate(routes.createCharacter)}><ButtonText>{text.general.createNew}</ButtonText><ArrowUpRightIcon /></OutlinedButton>
          </CardActionsContainer>
        </>
      </CharacterWrapper>
      {showDetail && (
        <CharacterDetail character={character} onClick={showCharacterDetail} />
      )}
    </>
  );
};
