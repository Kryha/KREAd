import { FC } from "react";
import { NavigationTab } from "../navigation-tab";

import { TopbarContainer } from "./styles";

interface BaseRouteProps {
  sideNavigation: React.ReactNode;
};

export const BaseRoute: FC<BaseRouteProps> = ({ children, sideNavigation }) => {
  return (
    <>
      <TopbarContainer>
        <NavigationTab />
        {sideNavigation}
      </TopbarContainer>
      {children}
    </>
  );
};
