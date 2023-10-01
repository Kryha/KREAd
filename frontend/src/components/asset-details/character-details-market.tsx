import { FadeInOut } from "../fade-in-out";
import { DetailContainer } from "../../pages/shop/styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { Overlay } from "../atoms";
import { FC, useState } from "react";
import { text } from "../../assets";
import { routes } from "../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationWrapper } from "../notification-detail/styles";
import { NotificationDetail } from "../notification-detail";
import { CharacterInMarket } from "../../interfaces";
import { ErrorView } from "../error-view";

interface Props {
  characterInMarket?: CharacterInMarket;
  selectCharacter: (id: string) => void;
}
export const CharacterDetailsMarket: FC<Props> = ({ characterInMarket, selectCharacter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [close, setClose] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!characterInMarket) {
    console.error("Missing character data");
    return <ErrorView />;
  }

  const character = characterInMarket.character;

  const buyAsset = () => {
    navigate(`${routes.buyCharacter}/${characterInMarket.id}`, { state: location });
  };

  const { royalty, platformFee, price } = characterInMarket.sell;

  const totalPrice = Number(royalty + platformFee + price);

  const buyCharacterAction = {
    primary: { text: text.item.buy, onClick: buyAsset },
    price: totalPrice,
  };

  return (
    <>
      <FadeInOut show={!!character.name} exiting={close}>
        {!!character.name && (
          <DetailContainer>
            <CharacterDetailSection
              character={{
                nft: character,
                equippedItems: characterInMarket.equippedItems,
              }}
              actions={{
                onClose: () => {
                  selectCharacter("");
                  setClose(true);
                },
                price: totalPrice,
                primary: buyCharacterAction.primary,
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
