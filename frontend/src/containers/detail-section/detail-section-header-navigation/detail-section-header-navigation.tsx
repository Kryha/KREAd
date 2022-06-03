import { FC } from "react";
import { DetailSectionHeaderNavigationWrap } from "./styles";
import { ButtonText, PrimaryButton, SecondaryButton } from "../../../components";
import { text } from "../../../assets/text";
import { ButtonClose } from "../../../components/button-close";
import { color } from "../../../design";

interface HeaderNavigationProps {
  handleClose: () => void;
}

// TODO: Pass ButtonClose callback as onClick prop
export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ handleClose }) => {
  return (
    <DetailSectionHeaderNavigationWrap>
      <PrimaryButton>
        <ButtonText customColor={color.white}>{text.character.equip}</ButtonText>
      </PrimaryButton>
      <SecondaryButton>
        <ButtonText>{text.character.sell}</ButtonText>
      </SecondaryButton>
      <ButtonClose onClick={handleClose} />
    </DetailSectionHeaderNavigationWrap>
  );
};
