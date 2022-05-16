import { FC } from "react";
import { BaseRoute } from "../../components";
import { PageTitle } from "../../components/atoms";
import { text } from "../../assets/text";

export const Inventory: FC = () => {
  return (
    // TODO: Add side bar component
    <BaseRoute sideNavigation={<PageTitle>{text.navigation.inventory}</PageTitle>}>

      {/* Left Column */}
        {/* Item Detail Container */}
      {/* Right Column */}
        {/* Sidebar / Item List */}

    </BaseRoute>
  );
}
