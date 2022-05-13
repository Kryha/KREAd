import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import { text } from "../../assets";
import { routes } from "../../navigation";
import { NavTabs, NavTab, NavTitle } from "./styles";
import { color } from "../../design";;


export const NavigationTab: FC = () => {
  const location = useLocation();
  const currentTab = location.pathname;

  return (
    <Box>
      <NavTabs
        value={currentTab}
        TabIndicatorProps={{
          style: {
            backgroundColor: color.black,
            border: `1.2px solid ${color.black}`,
          }
        }}
      >
        <Tab label={<NavTitle>{text.navigation.character}</NavTitle>} value={routes.root} to={routes.root} component={NavTab} />
        <Tab label={<NavTitle>{text.navigation.shop}</NavTitle>} value={routes.shop} to={routes.shop} component={NavTab} />
        <Tab label={<NavTitle>{text.navigation.inventory}</NavTitle>} value={routes.inventory} to={routes.inventory} component={NavTab} />
      </NavTabs>
    </Box>
  );
};
