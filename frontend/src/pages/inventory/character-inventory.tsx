import React, { FC, useEffect, useState } from "react";
import { text } from "../../assets";
import { HorizontalDivider, OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useMyCharacter, useMyCharacters } from "../../service";
import { OverviewContainer } from "../shop/styles";
import { CharacterDetailsInventory } from "../../components/asset-details/character-details-inventory";
import { CharacterCardsInventory } from "../../components/asset-cards/character-cards-inventory";
import { AssetFilterCount } from "../../components/asset-item-filters/styles";
import { color } from "../../design";
import { SECTION } from "../../constants";
import { AssetCharacterFilters } from "../../components/asset-character-filters/asset-character-filters";

interface Props {
  pageSelector?: React.ReactNode;
}

export const CharactersInventory: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const [characters, isLoadingCharacters] = useMyCharacters();
  const [character] = useMyCharacter(selectedId);
  const [isLoading, setIsLoading] = useState(true);

  const assetsCount = characters.length;

  useEffect(() => {
    setIsLoading(false);
  }, [isLoadingCharacters]);

  return (
    <>
      <AssetCharacterFilters section={SECTION.INVENTORY} pageSelector={pageSelector} />
      <AssetFilterCount customColor={color.darkGrey}>Inventory: {text.param.amountOfCharacters(assetsCount)}</AssetFilterCount>
      <HorizontalDivider />
      {character && <CharacterDetailsInventory character={character} selectedId={(id: string) => setSelectedId(id)} />}
      {characters.length > 0 ? (
        <CharacterCardsInventory characters={characters} isLoading={isLoading} selectCharacter={(id: string) => setSelectedId(id)} />
      ) : (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.inventory.noCharactersTitle}
            descriptionText={text.inventory.noCharactersDescription}
            buttonText={text.character.buyCharactersFromStore}
            redirectRoute={routes.character}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
