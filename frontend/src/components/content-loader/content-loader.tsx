import React, { FC, useEffect, useState } from "react";
import { AnimatedLoading } from "./animated-loading";
import { LoadingDevMode, LoadingPageContainer, Spinner } from "./styles";
import { DevelopmentMode } from "../../service/test-service/development-mode";

interface ContentLoaderProps {
  loading: boolean;
  children?: React.ReactNode;
  spinner?: boolean;
}
interface LoadingPageProps {
  spinner?: boolean;
}

export const LoadingPage: FC<LoadingPageProps> = ({ spinner = true }) => {
  const [showDevelopmentMode, setShowDevelopmentMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "d") {
        console.log("Key combination pressed");
        setShowDevelopmentMode((prevMode) => !prevMode);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {showDevelopmentMode && (
        <LoadingDevMode>
          <DevelopmentMode />
        </LoadingDevMode>
      )}
      <LoadingPageContainer isSpinner={spinner}>{spinner ? <Spinner /> : <AnimatedLoading />}</LoadingPageContainer>
    </>
  );
};

export const ContentLoader: FC<ContentLoaderProps> = ({ loading, children, spinner }) => {
  return <>{loading ? <LoadingPage spinner={spinner} /> : children}</>;
};
