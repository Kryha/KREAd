import { FC, useMemo, useState } from "react";

import { BaseRoute, ErrorView, LoadingPage } from "../../components";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container";
import { ItemDetailSection } from "../../containers/detail-section";
import { Title } from "../../components/title";
import { SortableList } from "../../containers/sortable-list";
import { useItems } from "../../service";

export const Inventory: FC = () => {
  const { data: items, isLoading } = useItems();
  const [selectedItemId, setSelectedItemtId] = useState<string>("");

  const item = useMemo(() => items?.find((item) => item.id === selectedItemId), [items, selectedItemId]);

  const closeDetail = () => setSelectedItemtId("");

  if (isLoading) return <LoadingPage />;

  if (!items || !items.length) return <ErrorView />;

  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} items={items.length} />}>
      <PageContainer sidebarContent={<SortableList list={items} setElementId={setSelectedItemtId} />}>
        <ItemDetailSection item={item} onClose={closeDetail} />
      </PageContainer>
    </BaseRoute>
  );
};
