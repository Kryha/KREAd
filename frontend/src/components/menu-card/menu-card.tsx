import { FC } from "react";

import { Item } from "../../interfaces";
import { text } from "../../assets";
import {
  ArrowContainer,
  CardActionsContainer,
  Close,
  Divider,
  InfoContainer,
  Menu,
  MenuContainer,
  MenuContent,
  MenuHeader,
  Content,
  ArrowUpRight,
} from "./styles";
import { ButtonText, ImageProps, Label, MenuText, SecondaryButton } from "../atoms";
import { MenuItem } from "../menu-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { GO_BACK } from "../../constants";
import { useViewport } from "../../hooks";

interface MenuCardProps extends ImageProps {
  title: string;
  items: Item[];
  amount: number;
}

export const MenuCard: FC<MenuCardProps> = ({ title, items, amount, width, height, marginTop, marginLeft }) => {
  const navigate = useNavigate();
  const { width: viewWidth, height: viewHeight } = useViewport();

  return (
    <Menu width={viewWidth} height={viewHeight}>
      <MenuHeader>
        <MenuContainer>
          <MenuText>{title}</MenuText>
          <InfoContainer>
            <Label>{text.param.amountOfItems(amount)}</Label>
            <Divider />
            <ArrowContainer>
              <Close onClick={() => navigate(GO_BACK)} />
            </ArrowContainer>
          </InfoContainer>
        </MenuContainer>
      </MenuHeader>
      <Content>
        <MenuContent>
          {items.map((item) => (
            <MenuItem data={item} key={item.id} imageProps={{ width, height, marginTop, marginLeft }} />
          ))}
        </MenuContent>
      </Content>
      <CardActionsContainer>
        <SecondaryButton type="submit" onClick={() => navigate(routes.shop)}>
          <ButtonText>{text.store.buyMoreAtStore}</ButtonText>
          <ArrowUpRight />
        </SecondaryButton>
      </CardActionsContainer>
    </Menu>
  );
};
