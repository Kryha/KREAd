import React, { FC, useState } from "react";

import { originOptions, sortCharactersInventoryOptions, sortCharactersMarketOptions, titleOptions } from "../../assets/text/filter-options";
import { color } from "../../design";
import { ButtonText, ColorSelector, Filters, Label, PrimaryButton, Select } from "../../components";
import { text } from "../../assets";
import { SECTION } from "../../constants";
import { useFilters } from "../../context/filter-context";
import { AssetFilterContainer, AssetFilterWrapper, AssetSelectorContainer, SortAssetsByContainer } from "../asset-item-filters/styles";
import { useGetCharacterMarketPrices } from "../../service";
import { PriceRangeSlider } from "../price-range-slider/price-range-slider";

interface Props {
  section: (typeof SECTION)[keyof typeof SECTION];
}

export const AssetCharacterFilters: FC<Props> = ({ section }) => {
  const { title, origin, sort, reset, setOrigin, setTitle, setCharacterPrice, setSort, setColors, onReset } = useFilters();
  const [filterId, setFilterId] = useState("");
  const [prices, fetched] = useGetCharacterMarketPrices();

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  const handlePriceFilter = (range: {min: number, max: number}) => {
    setCharacterPrice(range);
  }
  return (
    <>
      <AssetFilterWrapper>
        <AssetFilterContainer>
          <AssetSelectorContainer>
            <Filters
              label={title.length === 0 ? text.filters.title : `${text.filters.title}: ${title.length}`}
              openFilter={openFilter}
              id={filterId}
              hasValue={title.length > 0}
            >
              <Select label={text.filters.title} onArrayChange={setTitle} options={titleOptions} isMultiSelect reset={reset} />
            </Filters>
            <Filters
              label={origin.length === 0 ? text.filters.origin : `${text.filters.origin}: ${origin.length}`}
              openFilter={openFilter}
              id={filterId}
              hasValue={origin.length > 0}
            >
              <Select label={text.filters.origin} onArrayChange={setOrigin} options={originOptions} isMultiSelect reset={reset} />
            </Filters>
            {section === SECTION.SHOP && (
              <Filters label={text.filters.price} openFilter={openFilter} id={filterId}>
                {fetched && <PriceRangeSlider prices={prices} setPrice={handlePriceFilter} reset={reset} />}
              </Filters>
            )}
            <Filters label={text.filters.color} openFilter={openFilter} id={filterId}>
              <ColorSelector handleChange={setColors} />
            </Filters>
          </AssetSelectorContainer>
          <AssetSelectorContainer>
            <>
              <SortAssetsByContainer>
                {section === SECTION.SHOP && (
                  <>
                    <Label customColor={color.black}>{text.filters.sortBy}</Label>
                    <Filters label={sort || text.filters.aToZ} openFilter={openFilter} id={filterId} hasValue={!!sort}>
                      <Select label={text.filters.aToZ} onChange={setSort} options={sortCharactersMarketOptions} reset={reset} />
                    </Filters>
                  </>
                )}
                {section === SECTION.INVENTORY && (
                  <>
                    <Label customColor={color.black}>{text.filters.sortBy}</Label>
                    <Filters label={sort || text.filters.aToZ} openFilter={openFilter} id={filterId} hasValue={!!sort}>
                      <Select label={text.filters.aToZ} onChange={setSort} options={sortCharactersInventoryOptions} reset={reset} />
                    </Filters>
                  </>
                )}
              </SortAssetsByContainer>
              <PrimaryButton onClick={() => onReset()}>
                <ButtonText customColor={color.white}>clear all</ButtonText>
              </PrimaryButton>
            </>
          </AssetSelectorContainer>
        </AssetFilterContainer>
      </AssetFilterWrapper>
    </>
  );
};
