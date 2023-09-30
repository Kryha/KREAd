import React, { FC, useState } from "react";
import { AssetFilterContainer, AssetFilterWrapper, AssetSelectorContainer, SortAssetsByContainer } from "./styles";
import { MAX_PRICE, MIN_PRICE, SECTION } from "../../constants";
import { Filters } from "../filters";
import { ColorSelector, PriceSelector, Select } from "../input-fields";
import { text } from "../../assets";
import { ButtonText, Label, PrimaryButton } from "../atoms";
import { color } from "../../design";
import {
  categoryOptions,
  originOptions,
  rarityOptions,
  sortItemsInventoryOptions,
  sortItemsMarketOptions,
} from "../../assets/text/filter-options";
import { useFilters } from "../../context/filter-context";

interface Props {
  section: (typeof SECTION)[keyof typeof SECTION];
}

export const AssetItemFilters: FC<Props> = ({ section }) => {
  const { categories, origin, sort, rarity, reset, price, setOrigin, setCategories, setRarity, setSort, setColors, setPrice, onReset } =
    useFilters();
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
            <Filters
              label={categories.length === 0 ? text.filters.category : `${text.filters.category}: ${categories.length}`}
              openFilter={openFilter}
              id={filterId}
              hasValue={categories.length > 0}
            >
              <Select label={text.filters.category} onArrayChange={setCategories} options={categoryOptions} isMultiSelect reset={reset} />
            </Filters>
            <Filters
              label={origin.length === 0 ? text.filters.origin : `${text.filters.origin}: ${origin.length}`}
              openFilter={openFilter}
              id={filterId}
              hasValue={origin.length > 0}
            >
              <Select label={text.filters.origin} onArrayChange={setOrigin} options={originOptions} isMultiSelect reset={reset} />
            </Filters>
            <Filters
              label={rarity.length === 0 ? text.filters.rarity : `${text.filters.rarity}: ${rarity.length}`}
              openFilter={openFilter}
              id={filterId}
              hasValue={rarity.length > 0}
            >
              <Select label={text.filters.rarity} onArrayChange={setRarity} options={rarityOptions} isMultiSelect reset={reset} />
            </Filters>
            {section === SECTION.SHOP && (
              <Filters label={text.filters.price} openFilter={openFilter} id={filterId}>
                {price && <PriceSelector handleChange={onPriceChange} min={MIN_PRICE} max={MAX_PRICE} />}
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
                      <Select label={text.filters.aToZ} onChange={setSort} options={sortItemsMarketOptions} reset={reset} />
                    </Filters>
                  </>
                )}
                {section === SECTION.INVENTORY && (
                  <>
                    <Label customColor={color.black}>{text.filters.sortBy}</Label>
                    <Filters label={sort || text.filters.aToZ} openFilter={openFilter} id={filterId} hasValue={!!sort}>
                      <Select label={text.filters.aToZ} onChange={setSort} options={sortItemsInventoryOptions} reset={reset} />
                    </Filters>
                  </>
                )}
              </SortAssetsByContainer>
              <PrimaryButton onClick={() => onReset()}>
                <ButtonText customColor={color.white}>clear all</ButtonText>
              </PrimaryButton>
            </>
            {/* TODO: Add checkbox for equip and forsale*/}
            {/*<Checkbox label={"for Sale"} checked={forSale} onChange={() => setForSale(!forSale)} />*/}
            {/*<Checkbox label={"equipped"} checked={!!equippedTo} onChange={() => setEquippedTo(equippedTo)} />*/}
          </AssetSelectorContainer>
        </AssetFilterContainer>
      </AssetFilterWrapper>
    </>
  );
};
