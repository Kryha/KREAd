import { FC, useState } from "react";

import { CloseIcon, MenuIcon, text } from "../../assets";

import { BaseCharacter, BaseRoute, CharacterCard, CharacterItems, SecondaryButton } from "../../view";
import { FakeCharcters } from "./fake-characters";
import { Items } from "./fake-item-data";

export const Landing: FC = () => {
  const [openCharacters, setOpenCharacters] = useState(false);

  return (
    <BaseRoute sideNavigation={
      <SecondaryButton onClick={() => setOpenCharacters(!openCharacters)}>
        {text.navigation.myCharacters}
        {openCharacters ? <CloseIcon /> : <MenuIcon />}
      </SecondaryButton>}
    >
      <BaseCharacter character={FakeCharcters[0]} isZoomed={openCharacters} />
      {Boolean(!openCharacters) && (
        <CharacterItems items={Items} />
      )}
      {Boolean(openCharacters) && (
        <CharacterCard characters={FakeCharcters} />
      )}
    </BaseRoute >
  );
};
