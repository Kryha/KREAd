/// <reference types="ses"/>
import React, { useEffect } from "react";

import { useAgoricContext } from "../../context/agoric";
import { useUserState } from "../../context/user";
import { useWalletState } from "../../context/wallet";
import { useCharactersMarket, useCreateCharacter } from "../character";
import styled from "@emotion/styled";
import StatusIndicator from "./service-status-indicator";
import { fontSize } from "../../design";
import { watchCharacterInventory } from "../storage-node/watch-character";

import { makeCopyBag } from "@agoric/store";
import { KreadContainer, KreadDevelopmentContainer } from "../../components/error-view/styles";
import { AnimatedLogo } from "../../components";
import { DevelopmentMode } from "./development-mode";
import { useGetItemsInShop } from "../items";

export const TestServiceUI = () => {
  const [service, dispatch] = useAgoricContext();
  const [charactersMarket] = useCharactersMarket();
  const [itemsMarket] = useGetItemsInShop();

  const { characters } = useUserState();
  const wallet = useWalletState();
  const createCharacter = useCreateCharacter();

  useEffect(() => {
    console.log("SERVICE:", service);
    if (service.chainStorageWatcher) {
      watchCharacterInventory(service.chainStorageWatcher, "test2", dispatch);
    }
  }, [service.chainStorageWatcher, charactersMarket]);

  const mintCharacterNFT = async () => {
    await createCharacter.mutateAsync({
      // Random 5 letter string
      name: Array.from(
        { length: 5 },
        () =>
          Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")[0]
      ).join(""),
    });
  };

  const mintCharacterAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeMintCharacterInvitation",
    };

    const want = {
      Asset: { brand: charBrand, value: makeCopyBag(harden([[{ name: "test2" }, 1n]])) },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const unequipItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];
    const itemBrand = service.tokenInfo.item.brand;
    const item = service.testCharacterInventory[3];

    const wantKey = character.keyId == 2 ? 1 : 2;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeUnequipInvitation",
    };

    const give = {
      CharacterKey1: { brand: charBrand, value: makeCopyBag([[character, 1n]]) },
    };

    const want = {
      CharacterKey2: {
        brand: charBrand,
        value: makeCopyBag([[{ ...character, keyId: wantKey }, 1n]]),
      },
      Item: {
        brand: itemBrand,
        value: makeCopyBag([[item, 1n]]),
      },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const unequipAllAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const wantKey = character.keyId == 2 ? 1 : 2;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeUnequipAllInvitation",
    };

    const give = {
      CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
    };

    const want = {
      CharacterKey2: {
        brand: charBrand,
        value: makeCopyBag(harden([[{ ...character, keyId: wantKey }, 1n]])),
      },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const equipItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;

    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const itemBrand = service.tokenInfo.item.brand;
    const item = wallet.item[0];

    const wantKey = character.keyId == 2 ? 1 : 2;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeEquipInvitation",
    };

    const give = {
      CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
      Item: { brand: itemBrand, value: makeCopyBag(harden([[item, 1n]])) },
    };

    const want = {
      CharacterKey2: {
        brand: charBrand,
        value: makeCopyBag(harden([[{ ...character, keyId: wantKey }, 1n]])),
      },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const swapItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;

    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const itemBrand = service.tokenInfo.item.brand;
    const giveItem = wallet.item[0];
    const wantItem = service.testCharacterInventory.filter((i: { category: any }) => i.category === giveItem.category)[0];

    const wantKey = character.keyId == 2 ? 1 : 2;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeItemSwapInvitation",
    };

    const give = {
      CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
      Item1: { brand: itemBrand, value: makeCopyBag(harden([[giveItem, 1n]])) },
    };

    const want = {
      CharacterKey2: {
        brand: charBrand,
        value: makeCopyBag(harden([[{ ...character, keyId: wantKey }, 1n]])),
      },
      Item2: { brand: itemBrand, value: makeCopyBag(harden([[wantItem, 1n]])) },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const sellCharacterAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeSellCharacterInvitation",
    };

    const give = {
      Character: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
    };

    const want = {
      Price: { brand: service.tokenInfo.ist.brand, value: 100n },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
        exit: { waived: null },
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const buyCharacterAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const istBrand = service.tokenInfo.ist.brand;

    const { sell, character } = charactersMarket[0];

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeBuyCharacterInvitation",
    };

    const give = {
      Price: { brand: istBrand, value: sell.price },
    };

    const want = {
      Character: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const sellItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;

    const itemBrand = service.tokenInfo.item.brand;
    const item = wallet.item[0];

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeSellItemInvitation",
    };

    const give = {
      Item: { brand: itemBrand, value: makeCopyBag(harden([[item, 1n]])) },
    };

    const want = {
      Price: { brand: service.tokenInfo.ist.brand, value: 100n },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
        exit: { waived: null },
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const buyItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const itemBrand = service.tokenInfo.item.brand;
    const istBrand = service.tokenInfo.ist.brand;
    const { sell, item } = itemsMarket[0];

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeBuyItemInvitation",
    };

    const give = {
      Price: { brand: istBrand, value: sell.price },
    };

    const want = {
      Item: { brand: itemBrand, value: makeCopyBag(harden([[{ ...item, id: Number(item.id) }, 1n]])) },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.walletConnection.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
        if (status === "error") {
          console.error("Offer error", data);
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
        }
        if (status === "accepted") {
          console.log("Offer accepted", data);
        }
      }
    );
  };

  const buttons = [
    { text: "STATE", onClick: () => console.log(service, wallet) },
    { text: "MINT", onClick: mintCharacterAddOffer },
    { text: "UNEQUIP", onClick: unequipItemAddOffer },
    { text: "UNEQUIPALL", onClick: unequipAllAddOffer },
    { text: "EQUIP", onClick: equipItemAddOffer },
    { text: "SWAP", onClick: swapItemAddOffer },
    { text: "SELLCHAR", onClick: sellCharacterAddOffer },
    { text: "BUYCHAR", onClick: buyCharacterAddOffer },
    { text: "SELLITEM", onClick: sellItemAddOffer },
    { text: "BUYITEM", onClick: buyItemAddOffer },
    // Add more buttons here
  ];

  return (
    <>
      <Container>
        <KreadContainer>
          <AnimatedLogo iteration={1} />
          <Title>🔧 Test Service UI </Title>
          <KreadDevelopmentContainer>
            <DevelopmentMode />
          </KreadDevelopmentContainer>
        </KreadContainer>
        <Main>
          <Section>
            <SectionTitle>Agoric Service Status:</SectionTitle>
            <StatusIndicator statusObject={service.status} />
          </Section>
          <Section>
            <SectionTitle>Statistics:</SectionTitle>
          </Section>
          <Section>
            <SectionTitle>Controls:</SectionTitle>
            <SectionControls>
              <ButtonContainerWrapper>
                <ButtonContainer>
                  {buttons.map((button, index) => (
                    <Button key={index} onClick={button.onClick}>
                      <ButtonText>{button.text}</ButtonText>
                    </Button>
                  ))}
                </ButtonContainer>
              </ButtonContainerWrapper>
            </SectionControls>
          </Section>
        </Main>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0;
  position: relative;
  height: 100vh;
  isolation: isolate;
  background: hsl(216, 17%, 17%);
  color: #fff;
`;

const Section = styled.div`
  position: relative;
  z-index: 2;
`;
const SectionTitle = styled.div`
  display: flex;
  -moz-box-pack: justify;
  justify-content: space-between;
  -moz-box-align: center;
  align-items: center;
  margin-bottom: 4px;
`;

const SectionControls = styled.div`
  display: flex;
  flex-direction: column;
  -moz-box-pack: center;
  justify-content: center;
  min-height: 1.625rem;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 32px;
  padding: 16px;
  isolation: isolate;
  max-width: 768px;
`;

const Title = styled.h1`
  position: relative;
  z-index: 2;
  font-size: ${fontSize.title};
  font-weight: 600;
  line-height: 1.2;
  color: initial;
  background-color: rgb(255, 255, 255);
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 8px;
  margin-bottom: 0;
`;

const ButtonText = styled.span``;

const Button = styled.button`
  display: flex;
  -moz-box-pack: center;
  justify-content: center;
  -moz-box-align: center;
  align-items: center;
  height: 4rem;
  border-style: solid;
  border-width: 3px;
  border-image: none 100% / 1 / 0 stretch;
  border-radius: 6px;
  border-color: hsl(218, 13%, 33%);
  color: hsl(194, 10%, 59%);
  background: none;
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: hsl(119, 34%, 64%);
    color: hsl(200, 6%, 90%);
  }

  &:active {
    background: #76d397;
    color: #fff;
  }
`;

const ButtonContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  list-style-type: none;
  isolation: isolate;
  flex-direction: column;
`;

const ButtonContainerWrapper = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 16px;
  background: transparent;
`;
