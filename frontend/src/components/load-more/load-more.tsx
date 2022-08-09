import { FC } from "react";
import { text } from "../../assets";
import { ButtonText, SecondaryButton } from "../atoms";
import { LoadMoreContainer, Refresh } from "./styles";

interface LoadMoreProps {
  isLoading: boolean;
  page?: number;
  loadMore: () => void;
}

export const LoadMore: FC<LoadMoreProps> = ({ isLoading, loadMore }) => {
  return (
    <LoadMoreContainer>
      <SecondaryButton disabled={false} onClick={() => {
        loadMore();
      }}>
        <ButtonText>{isLoading ? text.general.loading : text.general.loadMore}</ButtonText>
        <Refresh />
      </SecondaryButton>
    </LoadMoreContainer>
  );
};
