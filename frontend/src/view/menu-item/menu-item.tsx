
import { FC } from 'react';
import { Item } from "@agoric/types";

import { ImageCard, Img, Info, InfoContainer, InfoWrapper, MenuItemWrapper } from "./styles";
import { Badge, Label, MenuItemName } from "../atoms";
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
          {Boolean(item.equipped) && (
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
                  <Badge>
                    <Label>{text.general.equipped}</Label>
                  </Badge>
                </InfoWrapper>
              </Info>
              <HorizontalDivider />
            </>
          )}
          <Info>
            <ImageCard>
              <Img src={item.image} />
            </ImageCard>
            <InfoWrapper>
              <InfoContainer>
                <MenuItemName>{item.name}</MenuItemName>
                <Label>{text.param.itemId(item.id)}</Label>
              </InfoContainer>
            </InfoWrapper>
          </Info>
        </>
      ))}
    </MenuItemWrapper>
  );
}
