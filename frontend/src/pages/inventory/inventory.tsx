import { FC } from "react";
import { BaseRoute } from "../../components";
import { PageTitle } from "../../components/atoms";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container"

export const Inventory: FC = () => {
  return (
    // TODO: Add side bar component
    <BaseRoute sideNavigation={<PageTitle>{text.navigation.inventory}</PageTitle>}>
      <PageContainer mainContent={<h2>Main Content</h2>} sidebarContent={<h2>Sidebar Content</h2>}/>
    </BaseRoute>
  );
}
