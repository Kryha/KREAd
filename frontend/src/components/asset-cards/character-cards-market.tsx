import { FC, useState } from "react";
import { ASSETS_PER_PAGE } from "../../constants";
import { AssetCardLoadMore } from "../asset-card-load-more/asset-card-load-more";
import { AssetsContainer, AssetsShopWrapper } from "./styles";
import { useViewport } from "../../hooks";
import { LoadingPage } from "../content-loader";
import { CharacterInMarket } from "../../interfaces";
import { CharacterCardMarket } from "../asset-card/character-card-market";

interface Props {
  charactersInMarket: CharacterInMarket[];
  isLoading: boolean;
  selectCharacterId: (id: string) => void;
}

export const CharacterCardsMarket: FC<Props> = ({ charactersInMarket, isLoading, selectCharacterId }) => {
  const { height } = useViewport();
  const [visibleAssets, setVisibleAssets] = useState<number>(ASSETS_PER_PAGE);
  const loadMoreAssets = () => {
    setVisibleAssets((prevVisibleAssets) => prevVisibleAssets + ASSETS_PER_PAGE);
  };

  if (isLoading) return <LoadingPage spinner={false} />;
  return (
    <AssetsShopWrapper height={height}>
      {charactersInMarket.length > 0 && (
        <AssetsContainer>
          {charactersInMarket.slice(0, visibleAssets).map((characterInMarket) => (
            <CharacterCardMarket
              key={characterInMarket.character.name}
              characterInMarket={characterInMarket}
              onClick={() => selectCharacterId(characterInMarket.id)}
            />
          ))}
          {visibleAssets < charactersInMarket.length && <AssetCardLoadMore isLoading={isLoading} loadMore={loadMoreAssets} />}
        </AssetsContainer>
      )}
    </AssetsShopWrapper>
  );
};
