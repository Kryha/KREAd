import { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import { CardActionsContainer, CharacterWrapper, CharacterContent, ArrowUp, CharacterCardWrapper, EmptyViewContainer } from "./styles";
import { ButtonText, Overlay, PrimaryButton } from "../atoms";
import { CharacterItem } from "../character-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { Character } from "../../interfaces";
import { ButtonInfo } from "../button-info";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { CharacterDetailSection } from "../../containers/detail-section/character-detail-section";
import { EmptyCard } from "../empty-card";
import { FadeInOut } from "../fade-in-out";
import { useMyCharacters, useSelectedCharacter } from "../../service";
import { useCharacterStateDispatch } from "../../context/characters";

interface Props {
  id: string;
  showCard?: boolean;
}

export const CharacterCard: FC<Props> = ({ id, showCard = false }) => {
  const navigate = useNavigate();

  const [characters] = useMyCharacters();
  const [selectedCharacter] = useSelectedCharacter();
  const dispatch = useCharacterStateDispatch();

  const [character, setCharacter] = useState<Character>();
  const [close, setClose] = useState(false);
  const [intitial, setInitial] = useState(true);

  const { width, height } = useViewport();

  const sortedCharacters = useMemo(() => {
    const allItems = [...characters];
    const fromIndex = characters.findIndex((character) => character.id === id);
    allItems.splice(0, 0, ...allItems.splice(fromIndex, 1));
    return allItems;
  }, [characters, id]);

  const showInfo = (values: Character) => {
    setCharacter(values);
  };

  const removeInitial = () => {
    setInitial(false);
  };

  const select = (character: Character) => {
    if (!character) return;
    dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
  };

  const selectFromState = () => {
    if (!character) return;
    dispatch({ type: "SET_SELECTED_CHARACTER", payload: character });
  };

  const sell = () => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.id}`);
  };

  const detailActions = () => {
    if (!character) return {};
    if (character.id === selectedCharacter?.id) {
      return {
        secondary: { text: text.character.sell, onClick: sell },
        onClose: () => {
          setCharacter(undefined);
          setClose(true);
        },
      };
    } else {
      return {
        primary: { text: text.character.select, onClick: selectFromState },
        secondary: { text: text.character.sell, onClick: sell },
        onClose: () => {
          setCharacter(undefined);
          setClose(true);
        },
      };
    }
  };

  return (
    <>
      <FadeInOut show={showCard} exiting={close}>
        <CharacterWrapper width={width} height={height} showCard={showCard}>
          <EmptyViewContainer>
            {!sortedCharacters.length && (
              <EmptyCard title={text.character.thereAreNoCharactersAvailable} description={text.character.minANewCharcater} />
            )}
          </EmptyViewContainer>

          <CharacterContent>
            {sortedCharacters.map((character) => (
              <>
                {character.isEquipped ? (
                  <CharacterItem
                    character={character}
                    key={character.id}
                    onClick={showInfo}
                    onButtonClick={select}
                    id={id}
                    removeInitial={removeInitial}
                    isInitial={intitial}
                  />
                ) : (
                  <CharacterItem
                    character={character}
                    key={character.id}
                    onClick={showInfo}
                    onButtonClick={select}
                    id={id}
                    removeInitial={removeInitial}
                  />
                )}
              </>
            ))}
          </CharacterContent>

          <CardActionsContainer>
            <ButtonInfo title={text.general.toolTipTitle} info={text.general.toolTipInfo} />
            <PrimaryButton type="submit" onClick={() => navigate(routes.createCharacter)}>
              <ButtonText customColor={color.white}>{text.general.mintNew}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </CardActionsContainer>
        </CharacterWrapper>
      </FadeInOut>

      {character && (
        <CharacterCardWrapper>
          <CharacterDetailSection character={character} actions={detailActions()} />
        </CharacterCardWrapper>
      )}
      <FadeInOut show={!!character} exiting={!character}>
        <Overlay />
      </FadeInOut>
    </>
  );
};
