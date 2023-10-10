import { FC } from "react";
import { useMatch } from "react-router-dom";
import { ActiveLine, NavTab, NavTabs, NavTitle, Tab } from "./styles";

interface NavigationTabProps {
  route: string;
  title: string;
}

export const NavigationTab: FC<NavigationTabProps> = ({ route, title }) => {
  const match = useMatch({ path: route, end: true });
  return (
    <NavTabs>
      <Tab active={!!match}>
        <NavTitle>{title}</NavTitle>
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
