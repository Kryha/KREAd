import { FC } from "react";
import { BaseRoute } from "../../components";
import { PageTitle } from "../../components/atoms";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container";
import { DetailSection } from "../../containers/detail-section";

export const Inventory: FC = () => {
  return (
    <BaseRoute sideNavigation={<PageTitle>{text.navigation.inventory}</PageTitle>}>
      <PageContainer
        mainContent={<DetailSection />}
        sidebarContent={<h2>Sidebar Content</h2>}/>
    </BaseRoute>
  );
};
