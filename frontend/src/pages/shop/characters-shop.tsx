import React, { FC, ReactNode, useState } from "react";
import { SECTION } from "../../constants";
import { useGetCharacterInShopById, useGetCharacterMarketMetrics, useGetCharactersInShop } from "../../service";
import { routes } from "../../navigation";
import { OverviewContainer } from "./styles";
import { HorizontalDivider, OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { CharacterDetailsMarket } from "../../components/asset-details/character-details-market";
import { CharacterCardsMarket } from "../../components/asset-cards/character-cards-market";
import { AssetCharacterFilters } from "../../components/asset-character-filters/asset-character-filters";
import { AssetFilterCount } from "../../components/asset-item-filters/styles";
import { color } from "../../design";
import { findAverageValue, findMinimumValue, toTwoDecimals, uISTToIST } from "../../util";
import { MarketplaceMetrics } from "../../components/marketplace-metrics/marketplace-metrics";

interface Props {
  pageSelector?: ReactNode;
}

export const CharactersShop: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const [characters, isLoading] = useGetCharactersInShop();
  const metrics = useGetCharacterMarketMetrics();
  const [character] = useGetCharacterInShopById(selectedId);
  const assetsCount = characters.length;

  const metricsData = metrics
    ? [
        metrics.amountSold,
        metrics.collectionSize,
        "IST " + toTwoDecimals(findMinimumValue(characters.map((x) => uISTToIST(Number(x.sell.price))))),
        "IST " + toTwoDecimals(findAverageValue(characters.map((x) => uISTToIST(Number(x.sell.price))))),
        toTwoDecimals(metrics.averageLevel),
        toTwoDecimals(metrics.marketplaceAverageLevel),
      ]
    : [];

  return (
    <>
      <AssetCharacterFilters section={SECTION.SHOP} pageSelector={pageSelector} />
      <AssetFilterCount customColor={color.darkGrey}>Inventory: {text.param.amountOfCharacters(assetsCount)}</AssetFilterCount>
      {metrics ? <MarketplaceMetrics data={metricsData} /> : <></>}
      <HorizontalDivider />
      {selectedId && <CharacterDetailsMarket characterInMarket={character} selectCharacter={(id: string) => setSelectedId(id)} />}
      {characters.length > 0 ? (
        <CharacterCardsMarket charactersInMarket={characters} isLoading={isLoading} selectCharacterId={(id: string) => setSelectedId(id)} />
      ) : (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.store.thereAreNoCharactersInTheShop}
            descriptionText={text.store.thereAreNoCharactersAvailable}
            buttonText={text.navigation.goHome}
            redirectRoute={routes.character}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
