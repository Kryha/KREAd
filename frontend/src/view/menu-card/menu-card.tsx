
import { FC } from 'react';
import { Item } from "@agoric/types";
import CardContent from '@mui/material/CardContent';
import { CardHeader } from "@mui/material";
import { ArrowUpRightIcon, text } from "../../assets";
import { ArrowContainer, CardActionsContainer, Divider, InfoContainer, Menu, MenuContainer, MenuContent, MenuHeader } from "./styles";
import { Label, MenuText, OutlinedButton } from "../atoms";
import { MenuItem } from "../menu-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";


interface MenuCardProps {
  title: string;
  items: Item[];
  amount: number;
};

export const MenuCard: FC<MenuCardProps> = ({ title, items, amount }) => {
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
                <ArrowUpRightIcon />
              </ArrowContainer>
            </InfoContainer>
          </MenuContainer>
        </MenuHeader>
      )}
      />
      <CardContent>
        <MenuContent>
          <MenuItem items={items} />
        </MenuContent>
      </CardContent>
      <CardActionsContainer>
        {/* TODO: link to store */}
        <OutlinedButton type="submit" onClick={() => navigate(routes.root)}>{text.store.buyAtStore} <ArrowUpRightIcon /></OutlinedButton>
      </CardActionsContainer>
    </Menu>
  );
}
