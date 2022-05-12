import { FC, useState } from "react";

import { CloseIcon, MenuIcon, text } from "../../assets";

import { BaseCharacter, BaseRoute, CharacterCard, CharacterItems, SecondaryButton } from "../../view";
import { FakeCharcters } from "./fake-characters";
import { Items } from "./fake-item-data";
import { LandingContainer } from "./styles";

export const Landing: FC = () => {
  const [openCharacters, setOpenCharacters] = useState(false);

  return (
    <BaseRoute sideNavigation={
      <SecondaryButton onClick={() => setOpenCharacters(!openCharacters)}>
        {text.navigation.myCharacters}
        {openCharacters ? <CloseIcon /> : <MenuIcon />}
      </SecondaryButton>}
    >
      <LandingContainer isZoomed={openCharacters}>
        <BaseCharacter character={FakeCharcters[0]} isZoomed={openCharacters} size={openCharacters ? "large" : "normal"} />
      </LandingContainer>
      {Boolean(!openCharacters) && (
        <CharacterItems items={Items} />
      )}

      {Boolean(openCharacters) && (
        <CharacterCard characters={FakeCharcters} />
      )}

    </BaseRoute >
  );
};
