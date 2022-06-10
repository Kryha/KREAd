// TODO: finish this component

import { FC, useState } from "react";

import { Filters, Label, LoadingPage, MenuItem, Select } from "../../components";
import { ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useMyFilteredCharacters } from "../../service";

import { text } from "../../assets";
import { categories, sorting } from "../../assets/text/filter-options";

interface Props {
  onCharacterClick: (id: string) => void;
}

// TODO: Add filter & sortyng Hooks and components

export const CharactersList: FC<Props> = ({ onCharacterClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");

  const { data: characters, isLoading } = useMyFilteredCharacters();

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty section view
  if (!characters || !characters.length) return <></>;

  const handleCategoryChange = (selected: string) => {
    setSelectedCategory(selected);
  };

  const handleSortingChange = (selected: string) => {
    setSelectedSorting(selected);
  };

  return (
    <SortableListWrap>
      <ListHeader>
        <Filters label={text.filters.category}>
          <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={categories} />
        </Filters>
        <SortContainer>
          <Label>{text.filters.sortBy}</Label>
          <Filters label={text.filters.latest}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sorting} />
          </Filters>
        </SortContainer>
      </ListHeader>
      <ListContainer>
        {characters.map((character) => (
          <MenuItem
            data={{ ...character, image: character.items, category: character.type, id: character.characterId }}
            key={character.characterId}
            onClick={onCharacterClick}
          />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
