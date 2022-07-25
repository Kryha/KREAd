import { FC, useState } from "react";

import { ButtonText, ErrorView, Filters, Label, LoadingPage, MenuItem, Select } from "../../components";
import { CategoryContainer, ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useMyFilteredCharacters } from "../../service";

import { text } from "../../assets";
import { characterCategories, sorting } from "../../assets/text/filter-options";

interface Props {
  onCharacterClick: (id: string) => void;
}

export const CharactersList: FC<Props> = ({ onCharacterClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [filterId, setFilterId] = useState("");
  const [intitial, setInitial] = useState(true);

  const [myCharacters, isLoading] = useMyFilteredCharacters({ category: selectedCategory, sorting: selectedSorting });

  if (isLoading) return <LoadingPage />;

  if (!myCharacters || !myCharacters.length) return <ErrorView />;

  const handleCategoryChange = (selected: string) => {
    setSelectedCategory(selected);
  };

  const handleSortingChange = (selected: string) => {
    setSelectedSorting(selected);
  };

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  const removeInitial = () => {
    setInitial(false);
  };

  return (
    <SortableListWrap>
      <ListHeader>
        <CategoryContainer>
          <Filters label={text.filters.category} openFilter={openFilter} id={filterId}>
            <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={characterCategories} />
          </Filters>
        </CategoryContainer>
        <SortContainer>
          <Label>{text.filters.sortBy}</Label>
          <Filters label={text.filters.latest} openFilter={openFilter} id={filterId}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sorting} />
          </Filters>
        </SortContainer>
      </ListHeader>
      <ButtonText>{text.param.amountOfCharacters(myCharacters.length)}</ButtonText>
      <ListContainer>
        <MenuItem
          data={{ ...myCharacters[0], image: myCharacters[0].items, category: myCharacters[0].type, id: myCharacters[0].id }}
          key={myCharacters[0].id}
          onClick={onCharacterClick}
          removeInitial={removeInitial}
          isInitial={intitial}
          isEquipped={myCharacters[0].isEquipped}
        />
        {myCharacters.slice(1).map((character) => (
          <MenuItem
            data={{ ...character, image: character.items, category: character.type, id: character.id }}
            key={character.id}
            onClick={onCharacterClick}
            removeInitial={removeInitial}
            isEquipped={character.isEquipped}
          />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
