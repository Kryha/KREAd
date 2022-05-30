import { FC } from "react";

import { NavTabs, NavTitle, Tab, ActiveLine } from "./styles";

interface FormTabProps {
  active: boolean;
  title: string;
}

export const FormTab: FC<FormTabProps> = ({ active, title }) => {
  return (
    <NavTabs>
      <Tab>
        <NavTitle>{title}</NavTitle>
        <ActiveLine active={active}/>
      </Tab>
    </NavTabs>
  );
};
