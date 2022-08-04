import { FC } from "react";
import { text } from "../../assets";
import { ButtonText, SecondaryButton } from "../atoms";
import { LoadMoreContainer, Refresh } from "./styles";

interface LoadMoreProps {
  totalPages: number;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
}

export const LoadMore: FC<LoadMoreProps> = ({ totalPages, isLoading, page, setPage }) => {
  return (
    <>
      {totalPages !== page && (
        <LoadMoreContainer>
          <SecondaryButton onClick={() => setPage(page + 1)}>
            <ButtonText>{isLoading ? text.general.loading : text.general.loadMore}</ButtonText>
            <Refresh />
          </SecondaryButton>
        </LoadMoreContainer>
      )}
    </>
  );
};
