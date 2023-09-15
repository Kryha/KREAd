import { FC } from "react";
import { color } from "../../design";
import { ButtonText, MenuItemName } from "../atoms";
import { FadeInOut } from "../fade-in-out";
import { EmptyItemCard } from "../item-card";
import { EmptyCardWrapper, InfoContainer, ItemContainer } from "./styles";

interface EmptyCardProps {
  title: string;
  description: string;
}

export const EmptyCard: FC<EmptyCardProps> = ({ title, description }) => {
  return (
    <FadeInOut show exiting={false}>
      <EmptyCardWrapper>
        <ItemContainer>
          <EmptyItemCard />
          <InfoContainer>
            <MenuItemName>{title}</MenuItemName>
            <ButtonText customColor={color.darkGrey}>{description}</ButtonText>
          </InfoContainer>
        </ItemContainer>
      </EmptyCardWrapper>
    </FadeInOut>
  );
};
