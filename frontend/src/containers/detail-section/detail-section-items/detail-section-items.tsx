import { FC, useState } from "react";

import { text } from "../../../assets";
import { ButtonText, EmptyItemCard, ItemThumbnail, Label, MenuItemName } from "../../../components";
import { color } from "../../../design";
import { Item } from "../../../interfaces";

import {
  Divider,
  EmptyInfo,
  IdLabel,
  Info,
  InfoContainer,
  InfoWrapper,
  InlineDetails,
  LevelLabel,
  ListContainer,
  RedirectArrow,
} from "./styles";

interface ListItemProps {
  item: Item;
}

const ListItem: FC<ListItemProps> = ({ item }) => {
  const [selected, setSelected] = useState(false);

  return (
    <Info
      tabIndex={0}
      selected={selected}
      onClick={() => {
        // TODO: handle click
      }}
      onBlur={() => setSelected(false)}
    >
      <ItemThumbnail src={item.image} category={item.category} />
      <InfoWrapper>
        <InfoContainer>
          <MenuItemName>{item.name}</MenuItemName>
          <InlineDetails>
            <ButtonText customColor={color.darkGrey}>{item.category}</ButtonText>
            <Divider />
            <LevelLabel>{text.param.level(item.level)}</LevelLabel>
          </InlineDetails>
        </InfoContainer>
        <IdLabel>{text.param.id(item.id)}</IdLabel>
        <RedirectArrow />
      </InfoWrapper>
    </Info>
  );
};

const EmptyItem: FC = () => {
  return (
    <EmptyInfo>
      <EmptyItemCard />
      <InfoWrapper>
        <InfoContainer>
          <MenuItemName>{text.character.noItemEquipped}</MenuItemName>
          <Label>{text.character.noItemEquippedCharacter}</Label>
        </InfoContainer>
      </InfoWrapper>
    </EmptyInfo>
  );
};

interface SectionProps {
  items: Item[];
}

export const DetailSectionItems: FC<SectionProps> = ({ items }) => {
  if (!items.length)
    return (
      <ListContainer>
        <EmptyItem />
      </ListContainer>
    );

  return (
    <ListContainer>
      {items.map((item, i) => (
        <ListItem item={item} key={i} />
      ))}
    </ListContainer>
  );
};
