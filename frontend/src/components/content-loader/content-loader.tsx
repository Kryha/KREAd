import React, { FC } from "react";
import { AnimatedLoading } from "./animated-loading";
import { LoadingPageContainer, Spinner } from "./styles";

interface ContentLoaderProps {
  loading: boolean;
  children?: React.ReactNode;
  spinner?: boolean;
}
interface LoadingPageProps {
  spinner?: boolean;
}

export const LoadingPage: FC<LoadingPageProps> = ({ spinner = true }) => {
  return (
    <>
      <LoadingPageContainer isSpinner={spinner}>{spinner ? <Spinner /> : <AnimatedLoading />}</LoadingPageContainer>
    </>
  );
};

export const ContentLoader: FC<ContentLoaderProps> = ({ loading, children, spinner }) => {
  return <>{loading ? <LoadingPage spinner={spinner} /> : children}</>;
};
