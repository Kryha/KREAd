import { FC, useState } from "react";

import { ButtonText, ErrorView, Filters, HorizontalDivider, Label, LoadingPage, MenuItem, Select } from "../../components";
import { CategoryContainer, ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useMyCharactersFiltered } from "../../service";

import { text } from "../../assets";
import { characterCategories, sortingInventory } from "../../assets/text/filter-options";
import { color } from "../../design";

interface Props {
  onCharacterClick: (id: string) => void;
}

export const CharactersList: FC<Props> = ({ onCharacterClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [filterId, setFilterId] = useState("");
  const [intitial, setInitial] = useState(true);

  const [myCharacters, isLoading] = useMyCharactersFiltered({ category: selectedCategory, sorting: selectedSorting });

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
          <Filters label={selectedCategory || text.filters.category} openFilter={openFilter} id={filterId}>
            <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={characterCategories} />
          </Filters>
        </CategoryContainer>
        <SortContainer>
          <Label>{text.filters.sortBy}</Label>
          <Filters label={selectedSorting || text.filters.latest} openFilter={openFilter} id={filterId}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sortingInventory} />
          </Filters>
        </SortContainer>
      </ListHeader>
      <ButtonText customColor={color.darkGrey}>{text.param.amountOfCharacters(myCharacters.length)}</ButtonText>
      <HorizontalDivider />
      <ListContainer>
        <MenuItem
          data={{
            ...myCharacters[0].nft,
            image: myCharacters[0].equippedItems,
            category: myCharacters[0].nft.type,
            id: myCharacters[0].nft.id,
            characterImage: myCharacters[0].nft.image,
          }}
          key={myCharacters[0].nft.id}
          onClick={onCharacterClick}
          removeInitial={removeInitial}
          isInitial={intitial}
          isEquipped={myCharacters[0].isEquipped}
        />
        {myCharacters.slice(1).map((character) => (
          <MenuItem
            data={{
              ...character.nft,
              image: character.equippedItems,
              category: character.nft.type,
              id: character.nft.id,
              characterImage: character.nft.image,
            }}
            key={character.nft.id}
            onClick={onCharacterClick}
            removeInitial={removeInitial}
            isEquipped={character.isEquipped}
          />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
