import { FC } from "react";
import { text } from "../../assets";
import { ButtonText } from "../atoms";
import { LoadMoreContainer, LoadMoreWrapper, Refresh } from "./styles";

interface LoadMoreProps {
  isLoading: boolean;
  loadMore: () => void;
}

export const LoadMore: FC<LoadMoreProps> = ({ isLoading, loadMore }) => {
  return (
    <LoadMoreWrapper onClick={loadMore}>
      <LoadMoreContainer>
        <Refresh />
        <ButtonText>{isLoading ? text.general.loading : text.general.loadMore}</ButtonText>
      </LoadMoreContainer>
    </LoadMoreWrapper>
  );
};
