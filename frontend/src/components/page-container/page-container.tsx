import { FC } from "react";

import { PageWrap } from "./styles";

interface PageContainerProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ children, sidebarContent }) => {
  return (
    <PageWrap>
      {sidebarContent}
      {children}
    </PageWrap>
  );
};
