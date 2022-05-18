import { FC, useState } from "react";

import { CloseIcon, ExpandIcon, MenuIcon, text } from "../../assets";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { BaseRoute, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { BaseCharacter, ExpandButton } from "./styles";
import { useMyCharacter } from "../../service";

export const Landing: FC = () => {
  const { data: character, isLoading } = useMyCharacter();
  const [openTab, setOpenTab] = useState(false);
  const { width, height } = useViewport();

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty page
  if (!character) return <></>;

  return (
    <BaseRoute sideNavigation={
      <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
        {text.navigation.myCharacters}
        {openTab ? <CloseIcon /> : <MenuIcon />}
      </SecondaryButton>}
    >
      <BaseCharacter width={width} height={height} />
      {/* TODO: do something with expanding */}
      <ExpandButton><ExpandIcon />{text.general.showFull}</ExpandButton>
      {Boolean(!openTab) && (
        <CharacterItems items={character.items} />
      )}
    </BaseRoute >
  );
};
