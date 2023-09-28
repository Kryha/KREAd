import React, { FC, useState } from "react";

import { originOptions, sortCharactersInventoryOptions, sortCharactersMarketOptions, titleOptions } from "../../assets/text/filter-options";
import { color } from "../../design";
import { ButtonText, ColorSelector, Filters, Label, PriceSelector, PrimaryButton, Select } from "../../components";
import { text } from "../../assets";
import { MAX_PRICE, MIN_PRICE, SECTION } from "../../constants";
import { useFilters } from "../../context/filter-context";
import { AssetFilterContainer, AssetFilterWrapper, AssetSelectorContainer, SortAssetsByContainer } from "../asset-item-filters/styles";

interface Props {
  section: (typeof SECTION)[keyof typeof SECTION];
  pageSelector: React.ReactNode;
}

// TODO: TO FIX
export const AssetCharacterFilters: FC<Props> = ({ section, pageSelector }) => {
  const { title, origin, sort, reset, price, setOrigin, setTitle, setSort, setColors, setPrice, onReset } = useFilters();
  const [filterId, setFilterId] = useState("");

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  const onPriceChange = (min: number, max: number) => {
    setPrice({ min, max });
  };

  return (
    <>
      <AssetFilterWrapper>
        <AssetFilterContainer>
          <AssetSelectorContainer>
            {pageSelector}
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
          </AssetSelectorContainer>
          <AssetSelectorContainer>
            <>
              {section === SECTION.SHOP && (
                <Filters label={text.filters.price} openFilter={openFilter} id={filterId}>
                  {price && <PriceSelector handleChange={onPriceChange} min={MIN_PRICE} max={MAX_PRICE} />}
                </Filters>
              )}
              <Filters label={text.filters.color} openFilter={openFilter} id={filterId}>
                <ColorSelector handleChange={setColors} />
              </Filters>
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
            {/* TODO: Add checkbox for equip and forsale*/}
            {/*<Checkbox label={"equipped"} checked={!!equippedTo} onChange={() => setEquippedTo(equippedTo)} />*/}
          </AssetSelectorContainer>
        </AssetFilterContainer>
      </AssetFilterWrapper>
    </>
  );
};
