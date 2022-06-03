
import { FC } from 'react';
import { Items } from "../../types";

import { ImageCard, Info, InfoContainer, InfoWrapper, MenuItemWrapper } from "./styles";
import { Badge, Label, MenuItemName } from "../atoms";
import { HorizontalDivider } from "../atoms/lines";
import { text } from "../../assets/text";



interface MenuItemProps {
  items: Items[];
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
                  <img src={item.image} alt=""/>
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
              <img src={item.image} alt="" />
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
