import { FC } from "react";
import { text } from "../../assets";
import { ButtonText } from "../atoms";
import { AssetCardLoadMoreContainer, AssetCardLoadMoreWrapper, Refresh } from "./styles";

interface LoadMoreProps {
  isLoading: boolean;
  page?: number;
  loadMore: () => void;
}

export const AssetCardLoadMore: FC<LoadMoreProps> = ({ isLoading, loadMore }) => {
  return (
    <AssetCardLoadMoreWrapper onClick={loadMore}>
      <AssetCardLoadMoreContainer>
        <Refresh />
        <ButtonText>{isLoading ? text.general.loading : text.general.loadMore}</ButtonText>
      </AssetCardLoadMoreContainer>
    </AssetCardLoadMoreWrapper>
  );
};
