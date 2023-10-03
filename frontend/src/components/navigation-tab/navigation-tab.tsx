import { FC } from "react";
import { useMatch } from "react-router-dom";
import { ActiveLine, NavTab, NavTabs, NavTitle, Tab } from "./styles";
import { breakpoints } from "../../design";
import { useIsMobile } from "../../hooks";

interface NavigationTabProps {
  route: string;
  title: string;
  icon: any;
}

export const NavigationTab: FC<NavigationTabProps> = ({ route, title, icon }) => {
  const match = useMatch({ path: route, end: true });
  const isMobile = useIsMobile(breakpoints.tablet);
  return (
    <NavTabs>
      <Tab active={!!match}>
        <NavTitle>{isMobile ? icon : title}</NavTitle>
        <ActiveLine active={!!match} />
      </Tab>
    </NavTabs>
  );
};

interface NavigationSectionProps {
  route: string;
  children: React.ReactNode;
}

export const NavigationSection: FC<NavigationSectionProps> = ({ route, children }) => {
  return (
    <NavTab end to={route}>
      {children}
    </NavTab>
  );
};
