import { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import {
  CardActionsContainer,
  CharacterWrapper,
  CharacterContent,
  ArrowUp,
  CharacterCardWrapper,
  EmptyViewContainer,
} from "./styles";
import { ButtonText, PrimaryButton } from "../atoms";
import { CharacterItem } from "../character-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { Character } from "../../interfaces";
import { ButtonInfo } from "../button-info";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { CharacterDetailSection } from "../../containers/detail-section/character-detail-section";
import { EmptyCard } from "../empty-card";
interface CharacterCardProps {
  id: string;
  characters: Character[];
}

export const CharacterCard: FC<CharacterCardProps> = ({ id, characters }) => {
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character>();
  const { width, height } = useViewport();

  const sortedCharacters = useMemo(
    () => {
      const allItems = [...characters];
      const fromIndex = characters.findIndex((character) => character.characterId === id);
      allItems.splice(0, 0, ...allItems.splice(fromIndex, 1));
      return allItems;
    }, [characters, id]);

  const showInfo = (values: Character) => {
    setCharacter(values);
  };

  const choose = () => {
    // TODO: implement character choose
    console.log("TODO: implement character choose");
  };

  const sell = () => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.characterId}`);
  };

  return (
    <>
      <CharacterWrapper width={width} height={height}>
        <>
          <EmptyViewContainer>
            {!sortedCharacters.length && (
              <EmptyCard
                title={text.character.thereAreNoCharactersAvailable}
                description={text.character.minANewCharcater}
              />
            )}
          </EmptyViewContainer>
          <CharacterContent>
            {sortedCharacters.map((character, index) => (
              <CharacterItem character={character} key={index} onClick={showInfo} id={id} />
            ))}
          </CharacterContent>

          <CardActionsContainer>
            <ButtonInfo title={text.general.toolTipTitle} info={text.general.toolTipInfo} />
            <PrimaryButton type="submit" onClick={() => navigate(routes.createCharacter)}>
              <ButtonText customColor={color.white}>{text.general.mintNew}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </CardActionsContainer>
        </>
      </CharacterWrapper>

      {character && (
        <CharacterCardWrapper>
          <CharacterDetailSection
            character={character}
            actions={{
              primary: { text: text.character.choose, onClick: choose },
              secondary: { text: text.character.sell, onClick: sell },
              onClose: () => setCharacter(undefined),
            }}
          />
        </CharacterCardWrapper>
      )}
    </>
  );
};
