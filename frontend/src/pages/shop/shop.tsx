import { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import { BaseRoute, NotificationCard, Overlay, SwitchSelector, Title } from "../../components";
import { Close, NotificationButton, NotificationWrapper, ShopWrapper, Notification } from "./styles";
import { ItemsShop } from "./items-shop";
import { CharactersShop } from "./characters-shop";
import { color } from "../../design";

export enum Page {
  Items = 0,
  Characters = 1,
}

export const Shop: FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.Items);
  const [openNotification, setOpenNotifications] = useState(false);

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

  return (
    <BaseRoute sideNavigation={
      <NotificationWrapper>
        <Title title={text.navigation.shop} />
        <NotificationButton
          onClick={() => setOpenNotifications(!openNotification)}
          backgroundColor={openNotification ? color.lightGrey : color.white}
          open={openNotification}
        >
          {openNotification ? <Close /> : <Notification />}
        </NotificationButton>
      </NotificationWrapper>
    }>
      <ShopWrapper>
        {selectedPage === Page.Items ? <ItemsShop pageSelector={pageSelector} /> : <CharactersShop pageSelector={pageSelector} />}
      </ShopWrapper>
      {openNotification && (
        <>
          <NotificationCard />
          <Overlay />
        </>
      )}
    </BaseRoute>
  );
};
