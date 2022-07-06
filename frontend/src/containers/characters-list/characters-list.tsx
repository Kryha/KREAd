import { FC, useState } from "react";

import { ButtonText, Filters, Label, LoadingPage, MenuItem, Select } from "../../components";
import { ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useMyFilteredCharacters } from "../../service";

import { text } from "../../assets";
import { characterCategories, sorting } from "../../assets/text/filter-options";

interface Props {
  onCharacterClick: (id: string) => void;
}

// TODO: Add filter & sortyng Hooks and components
export const CharactersList: FC<Props> = ({ onCharacterClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [filterId, setFilterId] = useState("");
  const [myCharacters, isLoading] = useMyFilteredCharacters(selectedCategory, selectedSorting);

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty section view
  if (!myCharacters || !myCharacters.length) return <></>;

  const handleCategoryChange = (selected: string) => {
    setSelectedCategory(selected);
  };

  const handleSortingChange = (selected: string) => {
    setSelectedSorting(selected);
  };

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  return (
    <SortableListWrap>
      <ListHeader>
        <Filters label={text.filters.category} openFilter={openFilter} id={filterId}>
          <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={characterCategories} />
        </Filters>
        <SortContainer>
          <Label>{text.filters.sortBy}</Label>
          <Filters label={text.filters.latest} openFilter={openFilter} id={filterId}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sorting} />
          </Filters>
        </SortContainer>
      </ListHeader>
      <ButtonText>{text.param.amountOfCharacters(myCharacters.length)}</ButtonText>
      <ListContainer>
        {myCharacters.map((character) => (
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
