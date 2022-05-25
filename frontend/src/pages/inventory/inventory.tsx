import { FC } from "react";
import { BaseRoute } from "../../components";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container";
import { DetailSection } from "../../containers/detail-section";
import { Title } from "../../components/title";

// TODO: get items number from item service
// TODO: Add sidebar component
export const Inventory: FC = () => {
  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} items={354} />}>
      <PageContainer mainContent={<DetailSection />} sidebarContent={<h2>Sidebar Content</h2>} />
    </BaseRoute>
  );
};
