import { FC } from "react";
import { DetailSectionHeaderNavigationWrap } from "./styles";
import { ButtonText, PrimaryButton, SecondaryButton } from "../../../components";
import { text } from "../../../assets/text";
import { ButtonClose } from "../../../components/button-close";
import { color } from "../../../design";

// TODO: Pass ButtonClose callback as onClick prop
export const DetailSectionHeaderNavigation: FC = () => {
  return (
    <DetailSectionHeaderNavigationWrap>
      <PrimaryButton><ButtonText customColor={color.white}>{text.character.equip}</ButtonText></PrimaryButton>
      <SecondaryButton><ButtonText>{text.character.sell}</ButtonText></SecondaryButton>
      <ButtonClose />
    </DetailSectionHeaderNavigationWrap>
  );
};
