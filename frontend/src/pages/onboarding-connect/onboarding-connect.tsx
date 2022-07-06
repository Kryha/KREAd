import { FC, useState } from "react";

import { text } from "../../assets";
import {
  BaseCharacter,
  BaseRoute,
  ButtonText,
  CharacterItems,
  MenuText,
  Overlay,
  PrimaryButton,
  SecondaryButton
} from "../../components";
import {
  LandingContainer,
  NotificationWrapper,
  DetailContainer,
  ButtonContainer,
  CharacterCardWrapper,
  OnboardingConnectWrapper,
} from "./styles";
import {  } from "../../service";
import { CharacterDetailSection } from "../../containers/detail-section";
import { FakeCharcters } from "../../service/fake-characters";
import { color } from "../../design";

export const OnboardingConnect: FC = () => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <OnboardingConnectWrapper>
      <BaseRoute
        onboarding
        sideNavigation={
          <NotificationWrapper>
            {/* TODO: connect to wallet */}
            <PrimaryButton>
              <ButtonText customColor={color.white}>{text.general.connectWallet}</ButtonText>
            </PrimaryButton>
          </NotificationWrapper>
        }
      >
        <LandingContainer isZoomed>
          <BaseCharacter items={FakeCharcters[3].items} isZoomed size="normal" />
        </LandingContainer>
        <CharacterItems items={FakeCharcters[3].items} />
        <DetailContainer>
          <MenuText>{FakeCharcters[0].name}</MenuText>
          <ButtonContainer>
            <SecondaryButton onClick={() => setShowDetail(true)}>
              <ButtonText>{text.general.moreInfo}</ButtonText>
            </SecondaryButton>
            <ButtonText>{text.param.level(FakeCharcters[0].level)}</ButtonText>
          </ButtonContainer>
        </DetailContainer>
        {showDetail && (
          <CharacterCardWrapper>
            <CharacterDetailSection
              character={FakeCharcters[3]}
              actions={{ onClose: () => setShowDetail(false) }}
            />
          </CharacterCardWrapper>
        )}
        {showDetail && <Overlay />}
      </BaseRoute>
    </OnboardingConnectWrapper>
  );
};
