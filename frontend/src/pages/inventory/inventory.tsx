import { FC } from "react";
import { BaseRoute } from "../../components";

export const Inventory: FC = () => {
  return (
    // TODO: Add side bar component
    <BaseRoute sideNavigation={undefined}>
      <h1>Inventory</h1>
    </BaseRoute>
  );
};
