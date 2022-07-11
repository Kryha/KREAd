import { FC, useMemo, useState } from "react";

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
  MenuCardWrapper,
} from "./styles";
import { ButtonText, HorizontalDivider, ImageProps, Label, MenuText, Overlay, SecondaryButton } from "../atoms";
import { MenuItem } from "../menu-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { GO_BACK } from "../../constants";
import { useViewport } from "../../hooks";
import { ItemDetailSection } from "../../containers/detail-section/item-detail-section";
import { EmptyCard } from "../empty-card";

interface MenuCardProps extends ImageProps {
  title: string;
  items: Item[];
  amount: number;
}

export const MenuCard: FC<MenuCardProps> = ({ title, items, amount, width, height, marginTop, marginLeft }) => {
  const navigate = useNavigate();
  const { width: viewWidth, height: viewHeight } = useViewport();
  const [selectedId, setSelectedId] = useState<string>("");
  const item = useMemo(() => items?.find((item) => item.id === selectedId), [items, selectedId]);

  const equip = () => {
    // TODO: implement item equip
    console.log("TODO: implement item equip");
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellItem}/${selectedId}`);
  };

  return (
    <MenuCardWrapper>
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
            {!items.length && (
              <EmptyCard title={text.item.noItemEquipped} description={text.item.selectAnItemFrom} />
            )}
            {items.map((item, index) => (
              <>
                <MenuItem data={{ ...item, image: item.thumbnail }} imageProps={{ width, height, marginTop, marginLeft }} onClick={() => setSelectedId(item.id)} key={index}/>
                {item === items[0] && <HorizontalDivider />}
              </>
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
      {item && (
        <ItemDetailSection
          item={item}
          actions={{
            primary: { text: text.item.equip, onClick: equip },
            secondary: { text: text.item.sell, onClick: sell },
            onClose: () => setSelectedId(""),
          }}
        />
      )}
      {item && <Overlay />}
    </MenuCardWrapper>
  );
};
