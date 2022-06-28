import { FC } from "react";
import { color } from "../../design";
import { ButtonText, MenuItemName } from "../atoms";
import { EmptyItemCard } from "../item-card";
import { EmptyCardWrapper, InfoContainer, ItemContainer } from "./styles";

interface EmptyCardProps {
  title: string;
  description: string;
}

export const EmptyCard: FC<EmptyCardProps> = ({ title, description }) => {
  return (
    <EmptyCardWrapper>
      <ItemContainer>
        <EmptyItemCard />
        <InfoContainer>
          <MenuItemName>{title}</MenuItemName>
          <ButtonText customColor={color.darkGrey}>{description}</ButtonText>
        </InfoContainer>
      </ItemContainer>
    </EmptyCardWrapper>
  );
};
