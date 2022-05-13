
import { FC } from 'react';
import { Item } from "../../interfaces";

import { ImageCard, Info, InfoContainer, InfoWrapper, MenuItemWrapper } from "./styles";
import { Badge, Img, Label, MenuItemName } from "../atoms";
import { HorizontalDivider } from "../atoms/lines";
import { text } from "../../assets/text";



interface MenuItemProps {
  items: Item[];
};

export const MenuItem: FC<MenuItemProps> = ({ items }) => {
  return (
    <MenuItemWrapper>
      {items.map((item) => (
        <>
          <Info>
            <ImageCard>
              <Img src={item.image} />
            </ImageCard>
            <InfoWrapper>
              <InfoContainer>
                <MenuItemName>{item.name}</MenuItemName>
                <Label>{text.param.itemId(item.id)}</Label>
              </InfoContainer>
              {Boolean(item.equipped) && (
                <Badge>
                  <Label>{text.general.equipped}</Label>
                </Badge>
              )}
            </InfoWrapper>
          </Info>
          {Boolean(item.equipped) && (
            <HorizontalDivider />
          )}
        </>
      ))}
    </MenuItemWrapper>
  );
}
