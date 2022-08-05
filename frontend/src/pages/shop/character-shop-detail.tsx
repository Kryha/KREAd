import { FC, useState } from "react";

import { text } from "../../assets";
import { CharacterShopCard, OverviewEmpty, Overlay, FadeInOut, LoadMore } from "../../components";
import { useViewport } from "../../hooks";
import { DetailContainer, ItemContainer, ItemWrapper, LoadMoreWrapper } from "./styles";
import { CharacterInMarket } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { PAGE_SIZE } from "../../constants";
import { CharacterDetailSection } from "../../containers/detail-section";

interface Props {
  characters: CharacterInMarket[];
  totalPages: number;
  isLoading: boolean;
  selectedCategory: string;
  selectedSorting: string;
  selectedPrice: { min: number; max: number };
  setShowToast: (isShown: boolean) => void;
  page: number;
  setPage: (page: number) => void;
}

export const CharactersShopDetail: FC<Props> = ({
  characters,
  totalPages,
  isLoading,
  selectedCategory,
  selectedSorting,
  selectedPrice,
  setShowToast,
  page,
  setPage,
}) => {
  const { height } = useViewport();
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInMarket>();
  const [close, setClose] = useState(false);

  const noFilteredCharacters =
    (!selectedCategory.length || !selectedSorting.length || !selectedPrice) && (!characters || !characters.length);

  const buy = () => {
    if (!selectedCharacter) return;
    navigate(`${routes.buyCharacter}/${selectedCharacter.id}`);
  };

  const displayToast = () => {
    setShowToast(true);
  };

  return (
    <>
      {!characters || !characters.length ? (
        <OverviewEmpty
          headingText={text.store.thereAreNoCharactersInTheShop}
          descriptionText={text.store.thereAreNoCharactersAvailable}
          buttonText={text.navigation.goHome}
          redirectRoute={routes.character}
        />
      ) : (
        <>
          {!noFilteredCharacters && (
            <ItemWrapper height={height}>
              <ItemContainer>
                {characters.map((character) => (
                  <CharacterShopCard key={character.id} character={character} onClick={setSelectedCharacter} />
                ))}
              </ItemContainer>
              <LoadMoreWrapper>
                {characters.length > PAGE_SIZE && <LoadMore totalPages={totalPages} isLoading={isLoading} page={page} setPage={setPage} />}
              </LoadMoreWrapper>
            </ItemWrapper>
          )}
        </>
      )}
      <FadeInOut show={!!selectedCharacter} exiting={close}>
        {!!selectedCharacter && (
          <DetailContainer>
            <CharacterDetailSection
              character={{ nft: selectedCharacter.character, equippedItems: selectedCharacter.equippedItems }}
              equippedItems={selectedCharacter.equippedItems}
              actions={{
                onClose: () => {
                  setSelectedCharacter(undefined);
                  setClose(true);
                },
                primary: { text: text.item.buy, onClick: buy },
              }}
              showToast={displayToast}
            />
          </DetailContainer>
        )}
        <Overlay />
      </FadeInOut>
    </>
  );
};
