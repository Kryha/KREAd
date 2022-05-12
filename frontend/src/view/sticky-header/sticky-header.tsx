import { FC } from "react";

import { StickyHeadeWrapper } from "./styles";

interface StickyHeaderProps {
  title: string;
  badge: string;
  id: string;
  buttonOneText?: string;
  buttonTwoText?: string;
  isSubDetail: boolean;
}

export const StickyHeader: FC<StickyHeaderProps> = ({ title, badge, id, buttonOneText, buttonTwoText, isSubDetail = false }) => {
  return (
    <StickyHeadeWrapper>

    </StickyHeadeWrapper>
  );
}
