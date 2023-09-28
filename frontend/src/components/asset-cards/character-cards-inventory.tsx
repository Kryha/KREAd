import { FC, useState } from "react";
import { ASSETS_PER_PAGE } from "../../constants";
import { AssetCardLoadMore } from "../asset-card-load-more/asset-card-load-more";
import { AssetsContainer, AssetsWrapper } from "./styles";
import { useViewport } from "../../hooks";
import { LoadingPage } from "../content-loader";
import { ExtendedCharacter } from "../../interfaces";
import { CharacterCardInventory } from "../asset-card/character-card-inventory";

export interface AssetData {
  id: string;
  image: string;
  name: string;
  category: string;
  level: number;
  rarity: number;
  isEquipped?: boolean;
  isForSale?: boolean;
  price?: bigint;
}

interface Props {
  characters: ExtendedCharacter[];
  isLoading: boolean;
  selectCharacter: (id: number) => void;
}

export const CharacterCardsInventory: FC<Props> = ({ characters, isLoading, selectCharacter }) => {
  const { height } = useViewport();
  const [visibleAssets, setVisibleAssets] = useState<number>(ASSETS_PER_PAGE);
  const loadMoreAssets = () => {
    setVisibleAssets((prevVisibleAssets) => prevVisibleAssets + ASSETS_PER_PAGE);
  };

  if (isLoading) return <LoadingPage spinner={false} />;
  return (
    <AssetsWrapper height={height}>
      {characters.length > 0 && (
        <AssetsContainer>
          {characters.slice(0, visibleAssets).map((character) => (
            <CharacterCardInventory
              key={character.nft.id}
              extendedCharacter={character}
              onClick={() => selectCharacter(character.nft.id)}
            />
          ))}
          {visibleAssets < characters.length && <AssetCardLoadMore isLoading={isLoading} loadMore={loadMoreAssets} />}
        </AssetsContainer>
      )}
    </AssetsWrapper>
  );
};
