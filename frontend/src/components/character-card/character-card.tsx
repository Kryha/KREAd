import { FC, Fragment, useMemo, useState } from "react";

import { text } from "../../assets";
import { ArrowUp, CardActionsContainer, CharacterCardWrapper, CharacterContent, CharacterWrapper, EmptyViewContainer } from "./styles";
import { ButtonText, Overlay, PrimaryButton } from "../atoms";
import { CharacterItem } from "../character-item";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { ExtendedCharacter } from "../../interfaces";
import { ButtonInfo } from "../button-info";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { CharacterDetailSection } from "../../containers/detail-section";
import { EmptyCard } from "../empty-card";
import { FadeInOut } from "../fade-in-out";
import { useMyCharacters, useSelectedCharacter } from "../../service";
import { NotificationWrapper } from "../notification-detail/styles";
import { NotificationDetail } from "../notification-detail";
import { useUserStateDispatch } from "../../context/user";

interface Props {
  id: string;
  showCard?: boolean;
}

//TODO: GOING TO BE OBSOLETE
export const CharacterCard: FC<Props> = ({ id, showCard = false }) => {
  const navigate = useNavigate();

  const [characters] = useMyCharacters();
  const [selectedCharacter] = useSelectedCharacter();
  const userStateDispatch = useUserStateDispatch();

  const [character, setCharacter] = useState<ExtendedCharacter>();
  const [close, setClose] = useState(false);
  const [initial, setInitial] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const { width, height } = useViewport();

  const sortedCharacters = useMemo(() => {
    const allItems = [...characters];
    const fromIndex = characters.findIndex((character) => character.nft.id.toString() === id);
    allItems.splice(0, 0, ...allItems.splice(fromIndex, 1));
    return allItems;
  }, [characters, id]);

  const showInfo = (values: ExtendedCharacter) => {
    setCharacter(values);
  };

  const select = (character: ExtendedCharacter) => {
    if (!character) return;
    userStateDispatch({ type: "SET_SELECTED", payload: character });
  };

  const selectFromState = () => {
    if (!character) return;
    userStateDispatch({ type: "SET_SELECTED", payload: character });
  };

  const sell = () => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.nft.id}`);
  };

  const detailActions = () => {
    if (!character) return {};
    if (character.nft.id === selectedCharacter?.nft.id) {
      return {
        secondary: { text: text.character.sell, onClick: sell },
        onClose: () => {
          setCharacter(undefined);
          setClose(true);
        },
      };
    } else {
      return {
        primary: { text: text.character.select, onClick: selectFromState },
        secondary: { text: text.character.sell, onClick: sell },
        onClose: () => {
          setCharacter(undefined);
          setClose(true);
        },
      };
    }
  };

  const displayToast = () => {
    setShowToast(true);
  };

  return (
    <>
      <FadeInOut show={showCard} exiting={close}>
        <CharacterWrapper width={width} height={height} showCard={showCard}>
          <EmptyViewContainer>
            {!sortedCharacters.length && (
              <EmptyCard title={text.character.thereAreNoCharactersAvailable} description={text.character.minANewCharcater} />
            )}
          </EmptyViewContainer>

          <CharacterContent>
            {sortedCharacters.map((character) => (
              <Fragment key={character.nft.id}>
                {/* FIXME: character.isEquipped??? */}
                <CharacterItem
                  character={character}
                  onClick={showInfo}
                  onButtonClick={select}
                  id={id}
                  removeInitial={() => setInitial(false)}
                />
              </Fragment>
            ))}
          </CharacterContent>

          <CardActionsContainer>
            <ButtonInfo info={text.general.characterCardInfo} />
            <PrimaryButton type="submit" onClick={() => navigate(routes.createCharacter)}>
              <ButtonText customColor={color.white}>{text.general.mintNew}</ButtonText>
              <ArrowUp />
            </PrimaryButton>
          </CardActionsContainer>
        </CharacterWrapper>
      </FadeInOut>
      <FadeInOut show={!!character} exiting={!character?.nft}>
        {character && (
          <CharacterCardWrapper>
            <CharacterDetailSection showToast={displayToast} character={character} actions={detailActions()} />
          </CharacterCardWrapper>
        )}
      </FadeInOut>
      <FadeInOut show={!!character} exiting={!character}>
        <Overlay />
      </FadeInOut>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={() => setShowToast(false)}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </>
  );
};
