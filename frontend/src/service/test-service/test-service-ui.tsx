/// <reference types="ses"/>
import { useEffect } from "react";

import { useAgoricContext } from "../../context/agoric";
import { useUserState } from "../../context/user";
import { useWalletState } from "../../context/wallet";
import { useCharactersMarket, useCreateCharacter } from "../character";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useDataMode } from "../../hooks/use-data-mode";
import { routes } from "../../navigation";
import { KreadLogo } from "../../pages/onboarding/styles";
import StatusIndicator from "./service-status-indicator";
import { fontSize } from "../../design";
import { watchCharacterInventory } from "../storage-node/watch-character";
import { useItemsMarket } from "../items";

import { makeCopyBag } from "@agoric/store";
import { mintCharacter } from "../character/mint";
import { inventoryService } from "../character/inventory";
import { marketService } from "../character/market";

export const TestServiceUI = () => {
  const [service, dispatch] = useAgoricContext();
  const [charactersMarket, isLoading] = useCharactersMarket();
  const [itemsMarket, isLoadingItem] = useItemsMarket();

  const { characters } = useUserState();
  const wallet = useWalletState();
  const createCharacter = useCreateCharacter();
  const navigate = useNavigate();
  const { mockData } = useDataMode();

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

    mintCharacter({
      name: 'C-MONEY',
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => console.log("we done yoooo")
    });
  };

  const unequipItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];
    const itemBrand = service.tokenInfo.item.brand;
    const item = service.testCharacterInventory[3];

    inventoryService.unequipItem({
      item,
      character,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => console.log("unequippeddddd yo")
    });
  };

  const unequipAllAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    inventoryService.unequipAll({
      character,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => console.log("unequippeddddd yo")
    })
    
  };

  const equipItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;

    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const itemBrand = service.tokenInfo.item.brand;
    const item = wallet.item[0];

    inventoryService.equipItem({
      character,
      item,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => console.log("equippeddddd yo")
    })
  };

  const swapItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;

    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const itemBrand = service.tokenInfo.item.brand;
    const giveItem = wallet.item[0];
    const wantItem = service.testCharacterInventory.filter((i: any) => i.category === giveItem.category)[0];

    inventoryService.swapItems({
      character,
      giveItem,
      wantItem,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => console.log("unequippeddddd yo")
    })
  };

  const sellCharacterAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    marketService.sellCharacter({
      character,
      price: 100n,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        makeOffer: service.walletConnection.makeOffer,
        istBrand: service.tokenInfo.ist
      },
      callback: async () => console.log("SELLCHARACTER ADD OFFER")
    })
  };

  const buyCharacterAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;
    const istBrand = service.tokenInfo.ist.brand;
    const { sell, character } = charactersMarket[0];

    marketService.buyCharacter({
      character,
      price: sell.price,
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        makeOffer: service.walletConnection.makeOffer,
        istBrand,
      },
      callback: async () => console.log("SELLCHARACTER ADD OFFER")
    })
  };

  const sellItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;

    const itemBrand = service.tokenInfo.item.brand;
    const item = wallet.item[0];

    marketService.sellItem({
      item,
      price: 10n,
      service: {
        kreadInstance: instance,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
        istBrand: service.tokenInfo.ist
      },
      callback: async () => console.log("SELLCHARACTER ADD OFFER SUCCESS")
    })
  };

  const buyItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const itemBrand = service.tokenInfo.item.brand;
    const istBrand = service.tokenInfo.ist.brand;
    const { sell, item } = itemsMarket[0];

    marketService.buyItem({
      item,
      price: sell.price,
      service: {
        kreadInstance: instance,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
        istBrand
      },
      callback: async () => console.log("BUYCHARACTER ADD OFFER SUCCESS")
    })
  };

  const goHome = () => {
    navigate(routes.root);
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
        <AppBar>
          <LogoContainer onClick={goHome}>
            <KreadLogo />
          </LogoContainer>
          <Title>🔧 Test Service UI </Title>
        </AppBar>
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
              <ButtonContainer>
                {buttons.map((button, index) => (
                  <Button key={index} onClick={button.onClick}>
                    <ButtonText>{button.text}</ButtonText>
                  </Button>
                ))}
              </ButtonContainer>
            </SectionControls>
          </Section>
          <Section>
            <SectionTitle>Results:</SectionTitle>
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
  min-height: 100vh;
  height: 100%;
  isolation: isolate;
  background: hsl(216, 17%, 17%);
  color: #fff;
  overflow: scroll;
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

const AppBar = styled.header`
  --color-primary: hsl(53deg, 100%, 50%);
  display: flex;
  flex-direction: column;
  -moz-box-pack: justify;
  -moz-box-align: baseline;
  align-items: center;
  padding: 18px;
  border-bottom: 1px solid hsl(210deg, 15%, 20%);
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 32px;
  padding: 16px;
  isolation: isolate;
  max-width: 800px;
`;
const LogoContainer = styled.a`
  width: 100px;
  height: 24px;
  background: white;
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

const ButtonText = styled.span`
  margin-top: 8px;
`;

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
  border-color: hsl(210deg, 15%, 20%);
  color: hsl(210deg, 8%, 50%);
  background: none;
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: hsl(210deg, 15%, 30%);
    color: hsl(210deg, 8%, 80%);
  }

  &:active {
    background: #76d397;
    color: #fff;
  }
`;

const ButtonContainer = styled.ul`
  display: flex;
  gap: 16px;
  list-style-type: none;
  isolation: isolate;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
