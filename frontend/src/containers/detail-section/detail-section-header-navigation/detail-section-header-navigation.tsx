import { FC } from "react";
import { DetailSectionHeaderNavigationWrap } from "./styles";
import { PrimaryButton, SecondaryButton } from "../../../components";
import { text } from "../../../assets/text";
import { ButtonClose } from "../../../components/button-close";

interface HeaderNavigationProps {
  handleClose: () => void;
}

// TODO: Pass ButtonClose callback as onClick prop
export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ handleClose }) => {
  return (
    <DetailSectionHeaderNavigationWrap>
      <PrimaryButton>{text.character.equip}</PrimaryButton>
      <SecondaryButton>{text.character.sell}</SecondaryButton>
      <ButtonClose onClick={handleClose} />
    </DetailSectionHeaderNavigationWrap>
  );
};
