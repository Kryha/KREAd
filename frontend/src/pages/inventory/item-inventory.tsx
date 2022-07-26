import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AnimatedLogo, ErrorView, FadeInOut, LoadingPage } from "../../components";
import { PageContainer } from "../../components/page-container";
import { routes } from "../../navigation";
import { useEquipItem, useMyItem, useMyItems, useUnequipItem } from "../../service";
import { text } from "../../assets/text";
import { ItemsList } from "../../containers/items-list";
import { ItemDetailSection } from "../../containers/detail-section";
import { EmptyItemInventory } from "./empty-item-inventory";
import { DetailWrapper, KreadContainer } from "./styles";
import { useViewport } from "../../hooks";

export const ItemsInventory: FC = () => {
  const navigate = useNavigate();

  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  const [selectedId, setSelectedId] = useState<string>("");
  const [{ all: allItems }, isLoadingItems] = useMyItems();
  const [isLoading, setIsLoading] = useState(true);
  const [item] = useMyItem(selectedId);

  const { width, height } = useViewport();

  useEffect(() => {
    if (isLoadingItems || selectedId) return;
    if (allItems.length) {
      setSelectedId(allItems[0].id.toString());
    }
    setIsLoading(false);
  }, [allItems, isLoadingItems, selectedId]);

  const equip = () => {
    if (!item) return;
    equipItem.mutate({ itemId: item.id });
  };

  const unequip = () => {
    if (!item) return;
    unequipItem.mutate({ itemId: item.id });
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellItem}/${selectedId}`);
  };

  if (isLoadingItems || isLoading) return <LoadingPage />;

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;

  if (!item) return <EmptyItemInventory />;

  const detailActions = () => {
    if (item.isEquipped) {
      return { primary: { text: text.item.unequip, onClick: unequip } };
    } else {
      return { primary: { text: text.item.equip, onClick: equip }, secondary: { text: text.item.sell, onClick: sell } };
    }
  };

  return (
    <PageContainer sidebarContent={<ItemsList onItemClick={setSelectedId} />}>
      <FadeInOut show>
        <DetailWrapper>
          <ItemDetailSection item={item} actions={detailActions()} />
        </DetailWrapper>
      </FadeInOut>
      <KreadContainer height={height} width={width}>
        <AnimatedLogo iteration={1} />
      </KreadContainer>
    </PageContainer>
  );
};
