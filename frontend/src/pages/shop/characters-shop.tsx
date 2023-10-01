import React, { FC, useState } from "react";
import { METRICS_CHARACTER, SECTION } from "../../constants";
import { useGetCharacterInShopById, useGetCharacterMarketMetrics, useGetCharactersInShop } from "../../service";
import { routes } from "../../navigation";
import { OverviewContainer } from "./styles";
import { HorizontalDivider, OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { CharacterDetailsMarket } from "../../components/asset-details/character-details-market";
import { CharacterCardsMarket } from "../../components/asset-cards/character-cards-market";
import { AssetCharacterFilters } from "../../components/asset-character-filters/asset-character-filters";
import { AssetFilterCount, AssetHeader, AssetHeaderContainer } from "../../components/asset-item-filters/styles";
import { color } from "../../design";
import { findAverageValue, findMinimumValue, toTwoDecimals, uISTToIST } from "../../util";
import { MarketplaceMetrics } from "../../components/marketplace-metrics/marketplace-metrics";

export const CharactersShop: FC = () => {
  const [selectedId, setSelectedId] = useState<string>("");

  const [characters, isLoading] = useGetCharactersInShop();
  const metrics = useGetCharacterMarketMetrics();
  const [character] = useGetCharacterInShopById(selectedId);
  const assetsCount = characters.length;

  // TODO: replace identifier with logo
  const metricsData = metrics
    ? [
        metrics.amountSold,
        metrics.collectionSize,
        toTwoDecimals(findMinimumValue(characters.map((x) => uISTToIST(Number(x.sell.price))))),
        toTwoDecimals(findAverageValue(characters.map((x) => uISTToIST(Number(x.sell.price))))),
        toTwoDecimals(metrics.averageLevel),
        toTwoDecimals(metrics.marketplaceAverageLevel),
      ]
    : [];

  return (
    <>
      <AssetHeaderContainer>
        <AssetHeader>{metrics ? <MarketplaceMetrics data={metricsData} asset={METRICS_CHARACTER} /> : <></>}</AssetHeader>
        <AssetCharacterFilters section={SECTION.SHOP} />
      </AssetHeaderContainer>
      <AssetFilterCount customColor={color.darkGrey}>Market: {text.param.amountOfCharacters(assetsCount)}</AssetFilterCount>
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
