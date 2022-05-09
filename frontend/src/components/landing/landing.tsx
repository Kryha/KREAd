import { FC, useState } from "react";

import { CloseIcon, ExpandIcon, MenuIcon, text } from "../../assets";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { BaseRoute, CharacterItems, SecondaryButton } from "../../view";
import { Items } from "./fake-item-data";
import { BaseCharacter, ExpandButton, } from "./styles";

export const Landing: FC = () => {
  const [openTab, setOpenTab] = useState(false);
  const { width, height } = useViewport();

  return (
    <BaseRoute sideNavigation={
      <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
        {text.navigation.myCharacters}
        {openTab ? <CloseIcon /> : <MenuIcon />}
      </SecondaryButton>}
    >
      <BaseCharacter width={width} height={height} />
      <ExpandButton><ExpandIcon />{text.general.showFull}</ExpandButton>
      <CharacterItems items={Items} />
    </BaseRoute >
  );
};
