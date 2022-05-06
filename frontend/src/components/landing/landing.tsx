import { FC, useState } from "react";
import { CloseIcon, ExpandIcon, MenuIcon, text } from "../../assets";
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
      <ExpandButton><ExpandIcon />{text.general.showFull}</ExpandButton>
    </BaseRoute >
  );
};
