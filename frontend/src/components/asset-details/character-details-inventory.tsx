import { FadeInOut } from "../fade-in-out";
import { DetailContainer } from "../../pages/shop/styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { Overlay } from "../atoms";
import { FC, useState } from "react";
import { text } from "../../assets";
import { routes } from "../../navigation";
import { useNavigate } from "react-router-dom";
import { NotificationWrapper } from "../notification-detail/styles";
import { NotificationDetail } from "../notification-detail";
import { ExtendedCharacter } from "../../interfaces";
import { ErrorView } from "../error-view";

interface AssetDetailsInventoryProps {
  character?: ExtendedCharacter;
  selectedId: (id: string) => void;
}

export const CharacterDetailsInventory: FC<AssetDetailsInventoryProps> = ({ character, selectedId }) => {
  const navigate = useNavigate();
  const [close, setClose] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!character) {
    console.error("Missing character data");
    return <ErrorView />;
  }

  const sellAsset = () => {
    navigate(`${routes.sellCharacter}/${character.nft.id}`);
  };

  const sellCharacterAction = {
    text: text.character.sell,
    onClick: sellAsset,
  };

  return (
    <>
      <FadeInOut show={!!character} exiting={close}>
        {!!character && (
          <DetailContainer>
            <CharacterDetailSection
              character={character}
              actions={{
                onClose: () => {
                  selectedId("");
                  setClose(true);
                },
                secondary: sellCharacterAction,
              }}
            />
          </DetailContainer>
        )}
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
