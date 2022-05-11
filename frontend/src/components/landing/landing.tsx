import { FC, useState } from "react";

import { CloseIcon, ExpandIcon, MenuIcon, text } from "../../assets";
import { useViewport } from "../../hooks";

import { BaseRoute, SecondaryButton } from "../../view";
import { BaseCharacter, ExpandButton } from "./styles";

export const Landing: FC = () => {
  const [openCharacters, setOpenCharacters] = useState(false);
  const { width, height } = useViewport();

  return (
    <BaseRoute sideNavigation={
      <SecondaryButton onClick={() => setOpenCharacters(!openCharacters)}>
        {text.navigation.myCharacters}
        {openCharacters ? <CloseIcon /> : <MenuIcon />}
      </SecondaryButton>}
    >
      {/* TODO: do something with expanding */}
      <BaseCharacter width={width} height={height} />
      <ExpandButton><ExpandIcon />{text.general.showFull}</ExpandButton>
    </BaseRoute >
  );
};
