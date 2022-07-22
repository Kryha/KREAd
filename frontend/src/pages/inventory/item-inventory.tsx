import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { PageContainer } from "../../components/page-container";
import { routes } from "../../navigation";
import { useEquipItem, useMyItems, useUnequipItem } from "../../service";
import { text } from "../../assets/text";
import { ItemsList } from "../../containers/items-list";
import { ItemDetailSection } from "../../containers/detail-section";
import { EmptyItemInventory } from "./empty-item-inventory";
import { DetailWrapper } from "./styles";

export const ItemsInventory: FC = () => {
  const navigate = useNavigate();

  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  const [{ all: allItems }, isLoading] = useMyItems();
  const [selectedId, setSelectedId] = useState<string>("");

  const item = useMemo(() => allItems?.find((item) => item.id === selectedId), [allItems, selectedId]);

  useEffect(() => {
    if (isLoading || !!selectedId || !allItems.length) return;
    setSelectedId(allItems[0].id.toString());
  }, [allItems, isLoading, selectedId]);

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

  if (isLoading) return <LoadingPage />;

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
    </PageContainer>
  );
};
