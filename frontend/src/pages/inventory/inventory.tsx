import { FC, useEffect, useState } from "react";

import { BaseRoute, ErrorView, LoadingPage } from "../../components";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container";
import { DetailSection } from "../../containers/detail-section";
import { Title } from "../../components/title";
import { SortableList } from "../../containers/sortable-list";

import { useItems } from "../../service";
import { Item } from "../../interfaces";

export const Inventory: FC = () => {
  const { data: items, isLoading } = useItems();
  const [selectedItemId, setSelectedItemtId] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item>();

  useEffect(() => {
    const item = items?.find((item) => item.id === selectedItemId);
    !!item && setSelectedItem(item);
  }, [items, selectedItemId]);

  if (isLoading) return <LoadingPage />;

  if (!items || !items.length) return <ErrorView />;

  // TODO: pass an item prop to DetailSection based on the selectedElement state
  // TODO: pass callback of actions Sortable
  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} items={items.length} />}>
      <PageContainer
        mainContent={<DetailSection item={selectedItem} setSelectedItem={setSelectedItem} />}
        sidebarContent={<SortableList list={items} setElementId={setSelectedItemtId} />}
      />
    </BaseRoute>
  );
};
