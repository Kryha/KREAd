import { FC } from "react";

import { DetailSectionHeaderNavigationWrap } from "./styles";
import { ButtonText, PrimaryButton, SecondaryButton } from "../../../components";
import { ButtonClose } from "../../../components/button-close";
import { color } from "../../../design";

interface Actions {
  onClose?: () => void;
  primary?: {
    text: string;
    onClick: () => void;
  };
  secondary?: {
    text: string;
    onClick: () => void;
  };
}

interface HeaderNavigationProps {
  actions: Actions;
}

export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ actions }) => {
  const { primary, secondary, onClose } = actions;

  return (
    <DetailSectionHeaderNavigationWrap>
      {!!primary && (
        <PrimaryButton onClick={() => primary.onClick()}>
          <ButtonText customColor={color.white}>{primary.text}</ButtonText>
        </PrimaryButton>
      )}

      {!!secondary && (
        <SecondaryButton onClick={() => secondary.onClick()}>
          <ButtonText>{secondary.text}</ButtonText>
        </SecondaryButton>
      )}

      {!!onClose && <ButtonClose onClick={() => onClose()} />}
    </DetailSectionHeaderNavigationWrap>
  );
};
