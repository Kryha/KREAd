import { FC } from "react";

import { DetailSectionHeaderNavigationWrap } from "./styles";
import { ButtonText, PrimaryButton, SecondaryButton } from "../../../components";
import { ButtonClose } from "../../../components/button-close";
import { color } from "../../../design";

interface Actions {
  onClose: () => void;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
}

interface Text {
  leftButton: string;
  rightButton: string;
}

interface HeaderNavigationProps {
  actions: Actions;
  text: Text;
}

export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ actions, text }) => {
  return (
    <DetailSectionHeaderNavigationWrap>
      <PrimaryButton onClick={() => actions.onLeftButtonClick()}>
        <ButtonText customColor={color.white}>{text.leftButton}</ButtonText>
      </PrimaryButton>
      <SecondaryButton onClick={() => actions.onRightButtonClick()}>
        <ButtonText>{text.rightButton}</ButtonText>
      </SecondaryButton>
      <ButtonClose onClick={() => actions.onClose()} />
    </DetailSectionHeaderNavigationWrap>
  );
};
