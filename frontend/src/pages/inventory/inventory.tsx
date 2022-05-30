import { FC } from "react";

import { BaseRoute, ErrorView, LoadingPage } from "../../components";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container";
import { DetailSection } from "../../containers/detail-section";
import { Title } from "../../components/title";
import { SortableList } from "../../containers/sortable-list";

import { useMyItems } from "../../service";

export const Inventory: FC = () => {
  const { data: items, isLoading: isLoadingItems, isError: isErrorItems } = useMyItems();

  if (isLoadingItems) return <LoadingPage />;

  if (!items || !items.length || isErrorItems) return <ErrorView />;

  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} items={items.length} />}>
      <PageContainer mainContent={<DetailSection />} sidebarContent={<SortableList items={items} />} />
    </BaseRoute>
  );
};
