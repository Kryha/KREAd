import { FC } from "react";
import { text } from "../../assets";
import { Label, PageTitle } from "../atoms";

import { Divider, PageTitleContainer } from "./styles";

interface TitleProps {
  title: string;
  items?: number;
}

export const Title: FC<TitleProps> = ({ title, items }) => {
  return (
    <PageTitleContainer>
      {!!items && (
        <>
          <Label>{text.param.amountOfItems(items)}</Label>
          <Divider />
        </>
      )}
      <PageTitle>{title}</PageTitle>
    </PageTitleContainer>
  );
};
