import { FadeInOut } from "../fade-in-out";
import { DetailContainer } from "../../pages/shop/styles";
import { ItemDetailSection } from "../../containers/detail-section";
import { Overlay } from "../atoms";
import React, { FC, useState } from "react";
import { text } from "../../assets";
import { useEquipItem, useUnequipItem } from "../../service";
import { routes } from "../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorView } from "../error-view";
import { Item } from "../../interfaces";

interface ItemDetailsInventoryProps {
  item: Item;
  selectedItem: {
    name: string;
    category: string;
    characterName: string | undefined;
  };
  selectItem: (name: string, category: string, characterName: string | undefined) => void;
}
export const ItemDetailsInventory: FC<ItemDetailsInventoryProps> = ({ item, selectedItem, selectItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [close, setClose] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;
  const equipAsset = () => {
    setShowToast(!showToast);
    equipItem.mutate({ item });
  };

  const unequipAsset = () => {
    setShowToast(!showToast);
    unequipItem.mutate({ item });
  };

  const sellAsset = () => {
    navigate(`${routes.sellItem}/${item.category}/${item.name}`, { state: location });
  };

  const assetDetailActions = () => {
    if (item.equippedTo !== "") {
      return { primary: { text: text.item.unequip, onClick: unequipAsset } };
    } else {
      return {
        primary: { text: text.item.equip, onClick: equipAsset },
        secondary: { text: text.item.sell, onClick: sellAsset },
      };
    }
  };

  return (
    <>
      <FadeInOut show={!!selectedItem} exiting={close}>
        {!!selectedItem && (
          <DetailContainer>
            <ItemDetailSection
              item={item}
              actions={{
                onClose: () => {
                  selectItem("", "", undefined);
                  setClose(true);
                },
                primary: assetDetailActions()?.primary,
                secondary: assetDetailActions()?.secondary,
              }}
            />
          </DetailContainer>
        )}
        <Overlay />
      </FadeInOut>
    </>
  );
};
