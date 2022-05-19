
import { FC } from "react";
import { Item } from "../../interfaces";
import { CardHeader } from "@mui/material";
import { ArrowUpRightIcon, text } from "../../assets";
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
} from "./styles";
import { ButtonText, ImageProps, Label, MenuText, OutlinedButton } from "../atoms";
import { MenuItem } from "../menu-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { GO_BACK } from "../../constants";

interface MenuCardProps extends ImageProps {
  title: string;
  items: Item[];
  amount: number;
}

export const MenuCard: FC<MenuCardProps> = ({ title, items, amount, width, height, marginTop, marginLeft }) => {
  const navigate = useNavigate();
  return (
    <Menu>
      <CardHeader component={() => (
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
      )}
      />
      <Content>
        <MenuContent>
          <MenuItem items={items} width={width} height={height} marginTop={marginTop} marginLeft={marginLeft} />
        </MenuContent>
      </Content>
      <CardActionsContainer>
        {/* TODO: link to store */}
        <OutlinedButton type="submit" onClick={() => navigate(routes.root)}><ButtonText>{text.store.buyAtStore}</ButtonText><ArrowUpRightIcon /></OutlinedButton>
      </CardActionsContainer>
    </Menu>
  );
};
