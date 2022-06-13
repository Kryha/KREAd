import { FC, useState } from "react";

import { text } from "../../../assets";
import { ImageProps, MenuItemName } from "../../../components";
import { Item } from "../../../interfaces";
import {
  CategoryButton,
  Divider,
  IdLabel,
  ImageCard,
  Info,
  InfoContainer,
  InfoWrapper,
  InlineDetails,
  ItemImage,
  LevelLabel,
  ListContainer,
  RedirectArrow,
} from "./styles";

interface ListItemProps {
  item: Item;
  imageProps?: ImageProps;
}

const ListItem: FC<ListItemProps> = ({ item, imageProps }) => {
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
      <ImageCard>
        <ItemImage
          src={item.image}
          category={item.category}
          width={imageProps?.width}
          height={imageProps?.height}
          marginTop={imageProps?.marginTop}
          marginLeft={imageProps?.marginLeft}
        />
      </ImageCard>
      <InfoWrapper>
        <InfoContainer>
          <MenuItemName>{item.name}</MenuItemName>
          <InlineDetails>
            <CategoryButton>{item.category}</CategoryButton>
            <Divider />
            <LevelLabel>{text.param.level(item.level)}</LevelLabel>
          </InlineDetails>
        </InfoContainer>
        <IdLabel>{text.param.itemId(item.id)}</IdLabel>
        <RedirectArrow />
      </InfoWrapper>
    </Info>
  );
};

interface SectionProps {
  items: Item[];
}

export const DetailSectionItems: FC<SectionProps> = ({ items }) => {
  // TODO: handle empty items list
  return (
    <ListContainer>
      {items.map((item, i) => (
        <ListItem item={item} key={i} />
      ))}
    </ListContainer>
  );
};
