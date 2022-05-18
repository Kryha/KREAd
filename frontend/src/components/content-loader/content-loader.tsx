import { FC } from "react";
import { Spinner, SpinnerContainer } from "./styles";

interface ContentLoaderProps {
  loading: boolean;
  children?: React.ReactNode;
}

export const LoadingPage: FC = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
);

export const ContentLoader: FC<ContentLoaderProps> = ({ loading, children }) => {
  return <>{loading ? <LoadingPage /> : children}</>;
};
