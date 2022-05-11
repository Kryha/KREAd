import { FC, useState } from "react";
import { text, CloseIcon, MenuIcon, ExpandIcon } from "../../assets";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { BaseRoute, SecondaryButton } from "../../view";
import { BaseCharacter, ExpandButton } from "./styles";

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
      {/* TODO: do something with expanding */}
      <ExpandButton><ExpandIcon />{text.general.showFull}</ExpandButton>
    </BaseRoute >
  );
};
