import { FC } from "react";
import { useMatch, useResolvedPath } from "react-router-dom";
import { NavTabs, NavTitle, Tab, NavTab, ActiveLine } from "./styles";

interface NavigationTabProps {
  route: string;
  title: string;
}

export const NavigationTab: FC<NavigationTabProps> = ({ route, title }) => {
  const resolved = useResolvedPath(route);
  const match = useMatch({ path: resolved.pathname, end: true });
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

export const NavigationSection: FC<NavigationSectionProps> = ({
  route,
  children,
}) => {
  return (
    <NavTab end to={route}>
      {children}
    </NavTab>
  );
};
