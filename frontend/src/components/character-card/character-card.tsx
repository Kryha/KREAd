import { FC, useCallback, useState } from "react";

import { text } from "../../assets";
import {
  CardActionsContainer,
  CharacterWrapper,
  CharacterContent,
  ArrowUp,
} from "./styles";
import { ButtonText, PrimaryButton } from "../atoms";
import { CharacterItem } from "../character-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { CharacterDetail } from "../character-detail";
import { Character } from "../../interfaces";
import { PriceInRun } from "../price-in-run";
import { MINTING_COST } from "../../constants";
import { ButtonInfo } from "../button-info";
import { color } from "../../design";
import { useViewport } from "../../hooks";
interface CharacterCardProps {
  id: string;
  characters: Character[];
}

export const CharacterCard: FC<CharacterCardProps> = ({ id, characters }) => {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [character, setCharacter] = useState<Character>();
  const { width, height } = useViewport();

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
      <CharacterWrapper width={width} height={height}>
        <>
          <CharacterContent>
            {sortedCharacters.map((character, index) => (
              <CharacterItem character={character} key={index} onClick={showInfo} id={id} />
            ))}
          </CharacterContent>
          <CardActionsContainer>
            <PriceInRun price={MINTING_COST} />
            <ButtonInfo title={text.general.toolTipTitle} info={text.general.toolTipInfo} />
            <PrimaryButton type="submit" onClick={() => navigate(routes.createCharacter)}>
              <ButtonText customColor={color.white}>{text.general.mintNew}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </CardActionsContainer>
        </>
      </CharacterWrapper>
      {Boolean(showDetail) && (
        <CharacterDetail character={character} onClick={showCharacterDetail} />
      )}
    </>
  );
};
