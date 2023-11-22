import { FC, useMemo, useState } from "react";
import { Item, Category } from "../../interfaces";
import { text } from "../../assets";
import {
  ArrowContainer,
  ArrowUpRight,
  CardActionsContainer,
  Close,
  Content,
  Divider,
  InfoContainer,
  Menu,
  MenuCardWrapper,
  MenuContainer,
  MenuContent,
  MenuHeader,
} from "./styles";
import { ButtonText, HorizontalDivider, ImageProps, Label, MenuText, Overlay, SecondaryButton } from "../atoms";
import { MenuItem } from "../menu-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { GO_BACK } from "../../constants";
import { useViewport } from "../../hooks";
import { ItemDetailSection } from "../../containers/detail-section";
import { EmptyCard } from "../empty-card";
import { useEquipItem, useUnequipItem } from "../../service";
import { FadeInOut } from "../fade-in-out";
import { NotificationDetail } from "../notification-detail";
import { NotificationWrapper } from "../notification-detail/styles";
import { handleOfferResultBuilder } from "../../util/contract-callbacks";

interface MenuCardProps {
  title: string;
  equippedItemProp?: Item;
  unequippedItems: Item[];
  category: Category;
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
  const unequipItem = useUnequipItem();

  const successCallback = () => setEquippedItem(undefined)

  const allItems = useMemo(() => {
    if (equippedItem) return [equippedItem, ...unequippedItems];
    return unequippedItems;
  }, [equippedItem, unequippedItems]);

  const selectedItem = useMemo(() => allItems?.find((item) => item.name === selectedName), [allItems, selectedName]);

  const equip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(!showToast);
    if (!selectedItem) return;
    equipItem.mutate({ item: selectedItem, callback: handleOfferResultBuilder() });
  };

  const unequip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(!showToast);
    if (!equippedItem) return;
    unequipItem.mutate({ item: equippedItem, callback: handleOfferResultBuilder(undefined, undefined, successCallback) });
  };

  const primaryActions = () => {
    if (selectedItem?.name === equippedItem?.name) {
      return {
        text: text.item.unequip,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => unequip(event),
      };
    } else {
      return {
        text: text.item.equip,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => equip(event),
      };
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
              {/* FIXME: missinf fn */}
              {/* <Label>{text.param.amountOfAssets(allItems.length)}</Label> */}
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
                onButtonClick={(event: React.MouseEvent<HTMLButtonElement>) => unequip(event)}
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
                onButtonClick={(event: React.MouseEvent<HTMLButtonElement>) => equip(event)}
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
