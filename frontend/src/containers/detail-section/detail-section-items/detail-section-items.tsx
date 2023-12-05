import { FC, useState } from "react";

import { text } from "../../../assets";
import { ButtonText, EmptyItemCard, ItemThumbnail, Label, MenuItemName, PrimaryButton } from "../../../components";
import { color } from "../../../design";
import { Item } from "../../../interfaces";
import { useUnequipItem } from "../../../service";

import {
  Divider,
  EmptyInfo,
  EquippedLabel,
  Info,
  InfoContainer,
  InfoTextContainer,
  InfoWrapper,
  InlineDetails,
  LevelLabel,
  ListContainer,
} from "./styles";

interface ListItemProps {
  item: Item | undefined;
  showToast: () => void;
}

const ListItem: FC<ListItemProps> = ({ item, showToast }) => {
  const [selected, setSelected] = useState(false);
  const unequipItem = useUnequipItem();

  if (!item) return null;

  const unequip = () => {
    showToast();
    unequipItem.mutate({ item, callback: {} });
  };

  return (
    <Info tabIndex={0} selected={selected} onBlur={() => setSelected(false)}>
      <ItemThumbnail src={item.image} category={item.category} />
      <InfoWrapper>
        <InfoContainer>
          <InfoTextContainer>
            <MenuItemName>{item.name}</MenuItemName>
            <EquippedLabel>{text.general.equipped}</EquippedLabel>
          </InfoTextContainer>
          <InlineDetails>
            <ButtonText customColor={color.darkGrey}>{item.category}</ButtonText>
            <Divider />
            <LevelLabel>{text.param.level(item.level)}</LevelLabel>
          </InlineDetails>
        </InfoContainer>
        <PrimaryButton onClick={() => unequip()}>
          <ButtonText customColor={color.white}>{text.character.unequip}</ButtonText>
        </PrimaryButton>
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
  items: (Item | undefined)[];
  showToast: () => void;
}

export const DetailSectionItems: FC<SectionProps> = ({ items, showToast }) => {
  if (!items.length)
    return (
      <ListContainer>
        <EmptyItem />
      </ListContainer>
    );

  return (
    <ListContainer>
      {items.map((item, i) => (
        <ListItem item={item} key={i} showToast={showToast} />
      ))}
    </ListContainer>
  );
};
