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
  const [close, setClose] = useState<boolean>(false);
  const { data: characters, isLoading } = useMyFilteredCharacters(selectedCategory, selectedSorting);

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
    <SortableListWrap tabIndex={0} onBlur={() => setClose(false)}>
      <ListHeader>
        <Filters label={text.filters.category} close={close}>
          <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={characterCategories} />
        </Filters>
        <SortContainer>
          <Label>{text.filters.sortBy}</Label>
          <Filters label={text.filters.latest} close={close}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sorting} />
          </Filters>
        </SortContainer>
      </ListHeader>
      <ButtonText>{text.param.amountOfCharacters(characters.length)}</ButtonText>
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
