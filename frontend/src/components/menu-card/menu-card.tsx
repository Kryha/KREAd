import { FC, useMemo, useState } from "react";
import { Item, ItemCategory } from "../../interfaces";
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
  equippedItemProp?: Item;
  unequippedItems: Item[];
  category: ItemCategory;
  imageProps?: ImageProps;
}

export const MenuCard: FC<MenuCardProps> = ({ title, category, equippedItemProp, unequippedItems, imageProps }) => {
  const navigate = useNavigate();
  const { width: viewWidth, height: viewHeight } = useViewport();
  const [selectedName, setSelectedName] = useState<string>("");
  const [intitial, setInitial] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [equippedItem, setEquippedItem] = useState(equippedItemProp);

  const equipItem = useEquipItem(setEquippedItem);
  const unequipItem = useUnequipItem(() => setEquippedItem(undefined));

  const allItems = useMemo(() => {
    if (equippedItem) return [equippedItem, ...unequippedItems];
    return unequippedItems;
  }, [equippedItem, unequippedItems]);

  const selectedItem = useMemo(() => allItems?.find((item) => item.name === selectedName), [allItems, selectedName]);

  const equip = (event: React.MouseEvent<HTMLButtonElement>, name: string) => {
    event.stopPropagation();
    setShowToast(!showToast);
    equipItem.mutate({ itemName: name });
  };

  const unequip = (event: React.MouseEvent<HTMLButtonElement>, name: string) => {
    console.log("🤕")
    event.stopPropagation();
    setShowToast(!showToast);
    unequipItem.mutate({ itemName: name });
  };

  const primaryActions = () => {
    if (selectedItem?.name === equippedItem?.name) {
      return { text: text.item.unequip, onClick: (event: React.MouseEvent<HTMLButtonElement>) => unequip(event, selectedName) };
    } else {
      return { text: text.item.equip, onClick: (event: React.MouseEvent<HTMLButtonElement>) => equip(event, selectedName) };
    }
  };

  const sell = () => {
    if (!selectedName) return;
    navigate(`${routes.sellItem}/${category}/${selectedName}`);
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
              <Label>{text.param.amountOfAssets(allItems.length)}</Label>
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
                onClick={() => setSelectedName(equippedItem.name)}
                key={equippedItem.name}
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
                onClick={() => setSelectedName(item.name)}
                key={item.name}
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
      <FadeInOut show={!!selectedName} exiting={!selectedName}>
        {selectedItem && (
          <ItemDetailSection
            item={selectedItem}
            actions={{
              primary: primaryActions(),
              secondary: { text: text.item.sell, onClick: sell },
              onClose: () => setSelectedName(""),
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
          />
        </NotificationWrapper>
      </FadeInOut>
    </MenuCardWrapper>
  );
};
