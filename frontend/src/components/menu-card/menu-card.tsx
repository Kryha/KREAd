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
import { useEquipItem, useUnequipItem } from "../../service";
import { FadeInOut } from "../fade-in-out";
import { NotificationDetail } from "../notification-detail";
import { NotificationWrapper } from "../notification-detail/styles";

interface MenuCardProps {
  title: string;
  equippedItem?: Item;
  unequippedItems: Item[];
  imageProps?: ImageProps;
}

export const MenuCard: FC<MenuCardProps> = ({ title, equippedItem, unequippedItems, imageProps }) => {
  const navigate = useNavigate();
  const { width: viewWidth, height: viewHeight } = useViewport();
  const [selectedId, setSelectedId] = useState<string>("");
  const [intitial, setInitial] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  const allItems = useMemo(() => {
    if (equippedItem) return [equippedItem, ...unequippedItems];
    return unequippedItems;
  }, [equippedItem, unequippedItems]);

  const selectedItem = useMemo(() => allItems?.find((item) => item.id === selectedId), [allItems, selectedId]);

  const equip = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    setShowToast(!showToast);
    equipItem.mutate({ itemId: id });
  };

  const unequip = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    setShowToast(!showToast);
    unequipItem.mutate({ itemId: id });
  };

  const primaryActions = () => {
    if (selectedItem?.id === equippedItem?.id) {
      return { text: text.item.unequip, onClick: (event: React.MouseEvent<HTMLButtonElement>) => unequip(event, selectedId) };
    } else {
      return { text: text.item.equip, onClick: (event: React.MouseEvent<HTMLButtonElement>) => equip(event, selectedId) };
    }
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellItem}/${selectedId}`);
  };

  const removeInitial = () => {
    setInitial(false);
  };

  const isDividerShown = !!equippedItem && !!unequippedItems.length;

  return (
    <MenuCardWrapper>
      <Menu width={viewWidth} height={viewHeight}>
        <MenuHeader>
          <MenuContainer>
            <MenuText>{title}</MenuText>
            <InfoContainer>
              <Label>{text.param.amountOfItems(allItems.length)}</Label>
              <Divider />
              <ArrowContainer>
                <Close onClick={() => navigate(GO_BACK)} />
              </ArrowContainer>
            </InfoContainer>
          </MenuContainer>
        </MenuHeader>

        <Content>
          <MenuContent>
            {equippedItem ? (
              <MenuItem
                data={{ ...equippedItem, image: equippedItem.thumbnail }}
                imageProps={imageProps}
                onClick={() => setSelectedId(equippedItem.id)}
                key={equippedItem.id}
                isEquipped
                onButtonClick={(event: React.MouseEvent<HTMLButtonElement>) => unequip(event, equippedItem.id)}
                isInitial={intitial}
                removeInitial={removeInitial}
              />
            ) : (
              <EmptyCard title={text.item.noItemEquipped} description={text.item.selectAnItemFrom} />
            )}

            {isDividerShown && <HorizontalDivider />}

            {unequippedItems.map((item) => (
              <MenuItem
                data={{ ...item, image: item.thumbnail }}
                imageProps={imageProps}
                onClick={() => setSelectedId(item.id)}
                key={item.id}
                onButtonClick={(event: React.MouseEvent<HTMLButtonElement>) => equip(event, item.id)}
                removeInitial={removeInitial}
              />
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
      <FadeInOut show={!!selectedId} exiting={!selectedId}>
        {selectedItem && (
          <ItemDetailSection
            item={selectedItem}
            actions={{
              primary: primaryActions(),
              secondary: { text: text.item.sell, onClick: sell },
              onClose: () => setSelectedId(""),
            }}
          />
        )}

        {selectedItem && <Overlay />}
      </FadeInOut>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={() => setShowToast(false)}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </MenuCardWrapper>
  );
};
