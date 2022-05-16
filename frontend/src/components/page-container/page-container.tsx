import { FC } from "react";

import { PageWrap } from "./styles";

interface PageContainerProps {
  mainContent: React.ReactNode;
  sidebarContent: React.ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ mainContent, sidebarContent }) => {
  return (
    <PageWrap>
      {mainContent}
      {sidebarContent}
    </PageWrap>
  );
};
