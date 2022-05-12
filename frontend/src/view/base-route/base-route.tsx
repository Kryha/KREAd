import { FC } from "react";
import { FCProps } from "../../types";
import { NavigationTab } from "../navigation-tab";

import { TopbarContainer } from "./styles";

interface BaseRouteProps extends FCProps {
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
