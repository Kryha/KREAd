import React, { FC } from "react";
import { AnimatedLoading } from "./animated-loading";
import { LoadingPageContainer, LoadingPageContainerMobile, Spinner } from "./styles";
import { useIsMobile } from "../../hooks";
import { breakpoints } from "../../design";

interface ContentLoaderProps {
  loading: boolean;
  children?: React.ReactNode;
  spinner?: boolean;
}
interface LoadingPageProps {
  spinner?: boolean;
}

export const LoadingPage: FC<LoadingPageProps> = ({ spinner = true }) => {
  const isMobile = useIsMobile(breakpoints.tablet);
  if(isMobile) {
    return (
      <>
        <LoadingPageContainerMobile isSpinner={spinner}>{spinner ? <Spinner /> : <AnimatedLoading />}</LoadingPageContainerMobile>
      </>
    );
  }
  return (
    <>
      <LoadingPageContainer isSpinner={spinner}>{spinner ? <Spinner /> : <AnimatedLoading />}</LoadingPageContainer>
    </>
  );
};

export const ContentLoader: FC<ContentLoaderProps> = ({ loading, children, spinner }) => {
  return <>{loading ? <LoadingPage spinner={spinner} /> : children}</>;
};
