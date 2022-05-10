
import { FC } from 'react';
import { Character } from "@agoric/types";
import CardContent from '@mui/material/CardContent';

import { ArrowUpRightIcon, text } from "../../assets";
import {
  CardActionsContainer,
  CharacterWrapper,
  CharacterContent,
} from "./styles";
import { OutlinedButton } from "../atoms";
import { CharacterItem } from "../character-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";


interface CharacterCardProps {
  characters: Character[];
};

export const CharacterCard: FC<CharacterCardProps> = ({ characters }) => {
  const navigate = useNavigate();
  return (
    <CharacterWrapper>
      <CardContent>
        <CharacterContent>
          {characters.map((character, index) => (
            <CharacterItem character={character} key={index} />
          ))}
        </CharacterContent>
        <CardActionsContainer>
          {/* TODO: link to create new */}
          <OutlinedButton type="submit" onClick={() => navigate(routes.root)}>{text.general.createNew} <ArrowUpRightIcon /></OutlinedButton>
        </CardActionsContainer>
      </CardContent>
    </CharacterWrapper>
  );
}
