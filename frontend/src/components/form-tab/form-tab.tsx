import { FC } from "react";
import { useViewport } from "../../hooks";

import { ActiveLine, NavTitle } from "./styles";

interface FormTabProps {
  active: boolean;
  title: string;
  amount: number;
}

export const FormTab: FC<FormTabProps> = ({ active, title, amount }) => {
  const { width } = useViewport();

  return (
    <NavTabs>
      <Tab width={width} amount={amount}>
        <NavTitle width={width} amount={amount} active={active}>
          {title}
        </NavTitle>
        <ActiveLine active={active} />
      </Tab>
    </NavTabs>
  );
};
