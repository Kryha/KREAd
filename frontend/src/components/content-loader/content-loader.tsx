import { FC } from "react";
import { AnimatedLoading } from "./animated-loading";
import { Spinner, SpinnerContainer } from "./styles";

interface ContentLoaderProps {
  loading: boolean;
  children?: React.ReactNode;
  spinner?: boolean;
}
interface LoadingPageProps {
  spinner?: boolean;
}

export const LoadingPage: FC<LoadingPageProps> = ({ spinner = true }) => (
  <SpinnerContainer isSpinner={spinner}>{spinner ? <Spinner /> : <AnimatedLoading />}</SpinnerContainer>
);

export const ContentLoader: FC<ContentLoaderProps> = ({ loading, children, spinner }) => {
  return <>{loading ? <LoadingPage spinner={spinner} /> : children}</>;
};
