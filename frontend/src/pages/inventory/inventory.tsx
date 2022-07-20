import { FC, useMemo, useState } from "react";

import { BaseRoute, NotificationCard, Overlay, SwitchSelector } from "../../components";
import { text } from "../../assets/text";
import { Title } from "../../components/title";
import { Page } from "../shop";
import { Close, InventoryWrapper, NotificationButton, NotificationWrapper, Notification, NotificationContainer, Tag } from "./styles";
import { color } from "../../design";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";
import { FadeInOut } from "../../components/fade-in-out";

export const Inventory: FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.Items);
  const [openNotification, setOpenNotifications] = useState(false);
  const [close, setClose] = useState(false);

  const pageSelector = useMemo(
    () => (
      <SwitchSelector
        buttonOneText={text.character.items}
        buttonTwoText={text.character.characters}
        setSelectedIndex={setSelectedPage}
        selectedIndex={selectedPage}
      />
    ),
    [selectedPage]
  );

  const showItemsInventory = selectedPage === Page.Items;
  return (
    <BaseRoute
      sideNavigation={
        <NotificationWrapper>
          <Title title={text.navigation.inventory} />
          <NotificationContainer>
            <NotificationButton
              open={openNotification}
              onClick={() => {
                setOpenNotifications(!openNotification);
                if (!openNotification) {
                  setClose(true);
                }
              }}
              backgroundColor={openNotification ? color.lightGrey : color.white}
            >
              {openNotification ? <Close /> : <Notification />}
            </NotificationButton>
            <Tag />
          </NotificationContainer>
        </NotificationWrapper>
      }
    >
      <InventoryWrapper>{pageSelector}</InventoryWrapper>
      {showItemsInventory ? <ItemsInventory /> : <CharactersInventory />}
      <FadeInOut show={openNotification} exiting={close}>
        <NotificationCard />
        <Overlay />
      </FadeInOut>
    </BaseRoute>
  );
};
