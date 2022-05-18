import { FC } from "react";
import { CloseButton, DetailSectionHeaderNavigationWrap } from "./styles";
import { PrimaryButton, SecondaryButton } from "../../../components";
import { text } from "../../../assets/text";

// TODO: Pass CloseButton callback as prop
export const DetailSectionHeaderNavigation: FC = () => {
  return (
    <DetailSectionHeaderNavigationWrap>
      <PrimaryButton>{text.character.equip}</PrimaryButton>
      <SecondaryButton>{text.character.sell}</SecondaryButton>
      <CloseButton />
    </DetailSectionHeaderNavigationWrap>
  );
};
