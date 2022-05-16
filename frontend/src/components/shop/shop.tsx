import { FC } from "react";
import { BaseRoute } from "../../view"

export const Shop: FC = () => {
  return (
    // TODO: Add side bar component
    <BaseRoute sideNavigation={undefined}>
      <h1>Shop</h1>
    </BaseRoute>
  );
}
