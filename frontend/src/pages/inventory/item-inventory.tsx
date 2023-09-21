import React, { FC, useState } from "react";
import { HorizontalDivider, LoadingPage, OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useGetItemInInventoryByNameAndCategory, useGetItemsInInventory } from "../../service";
import { text } from "../../assets";
import { OverviewContainer } from "../shop/styles";
import { AssetItemFilters } from "../../components/asset-item-filters/asset-item-filters";
import { ItemCardsInventory } from "../../components/asset-cards/item-cards-inventory";
import { AssetFilterCount } from "../../components/asset-item-filters/styles";
import { color } from "../../design";
import { SECTION } from "../../constants";
import { ItemDetailsInventory } from "../../components/asset-details/item-details-inventory";

interface Props {
  pageSelector?: React.ReactNode;
}

//TODO: you cannot open an items details that is unequipped

export const ItemsInventory: FC<Props> = ({ pageSelector }) => {
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCharacterName, setSelectedCharacterName] = useState<string | null>(null);

  const selectItem = (itemName: string, category: string, characterName: string | null) => {
    setSelectedName(itemName);
    setSelectedCategory(category);
    setSelectedCharacterName(characterName);
  };

  const [items, isLoading] = useGetItemsInInventory();

  const [item] = useGetItemInInventoryByNameAndCategory(selectedName, selectedCategory, selectedCharacterName);
  const assetsCount = items.length;

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <AssetItemFilters section={SECTION.INVENTORY} pageSelector={pageSelector} />
      <AssetFilterCount customColor={color.darkGrey}>Inventory: {text.param.amountOfItems(assetsCount)}</AssetFilterCount>
      <HorizontalDivider />
      {item && (
        <ItemDetailsInventory
          item={item}
          selectedItem={{ name: selectedName, category: selectedCategory, characterName: selectedCharacterName }}
          selectItem={selectItem}
        />
      )}
      {items.length > 0 ? (
        <ItemCardsInventory items={items} isLoading={isLoading} selectItem={selectItem} />
      ) : (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.inventory.noItemsTitle}
            descriptionText={text.item.buyItemsFromStore}
            buttonText={text.item.buyItemsFromStore}
            redirectRoute={routes.shop}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
