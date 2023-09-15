/// <reference types="ses"/>
import { useEffect } from "react";

import { useAgoricContext } from "../../context/agoric";
import { useUserState } from "../../context/user";
import { useWalletState } from "../../context/wallet";
import { useCharactersMarket, useCreateCharacter } from "../character";
import styled from "@emotion/styled";
import StatusIndicator from "./service-status-indicator";
import { fontSize } from "../../design";
import { watchCharacterInventory } from "../storage-node/watch-character";

import { KreadContainer, KreadDevelopmentContainer } from "../../components/error-view/styles";
import { AnimatedLogo } from "../../components";
import { DevelopmentMode } from "./development-mode";
import { mintCharacter } from "../character/mint";
import { inventoryService } from "../character/inventory";
import { marketService } from "../character/market";
import { useGetItemsInShop } from "../items";

export const TestServiceUI = () => {
  const [service, dispatch] = useAgoricContext();
  const [charactersMarket] = useCharactersMarket();
  const [itemsMarket] = useGetItemsInShop();

  const { characters } = useUserState();
  const wallet = useWalletState();
  const createCharacter = useCreateCharacter();
  const userState = useUserState();

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
            .replace(/[^a-z]+/g, "")[0],
      ).join(""),
    });
  };

  const mintCharacterAddOffer = async () => {
    const instance = service.contracts.kread.instance;
    const charBrand = service.tokenInfo.character.brand;

    mintCharacter({
      name: "C-MONEY",
      service: {
        kreadInstance: instance,
        characterBrand: charBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("MintCharacter call settled");
      },
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
      callback: async () => {
        console.info("Unequip call settled");
      },
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
      callback: async () => {
        console.info("UnequipAll call settled");
      },
    });
  };

  const equipItemAddOffer = async () => {
    const kreadInstance = service.contracts.kread.instance;

    const characterBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const itemBrand = service.tokenInfo.item.brand;
    const item = wallet.item[0];

    inventoryService.equipItem({
      character,
      item,
      service: {
        kreadInstance,
        characterBrand,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("Equip call settled");
      },
    });
  };

  const swapItemAddOffer = async () => {
    const instance = service.contracts.kread.instance;

    const charBrand = service.tokenInfo.character.brand;
    const character = wallet.character[0];

    const itemBrand = service.tokenInfo.item.brand;
    const giveItem = wallet.item[0];
    const wantItem = service.testCharacterInventory.filter((i: { category: any }) => i.category === giveItem.category)[0];

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
      callback: async () => {
        console.info("Swap call settled");
      },
    });
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
        istBrand: service.tokenInfo.ist,
      },
      callback: async () => {
        console.info("SellCharacter call settled");
      },
    });
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
      callback: async () => {
        console.info("BuyCharacter call settled");
      },
    });
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
        istBrand: service.tokenInfo.ist,
      },
      callback: async () => {
        console.info("SellItem call settled");
      },
    });
  };

  const sellItemBatchAddOffer = async () => {
    console.log(">>>>")
    const instance = service.contracts.kread.instance;
    const itemBrand = service.tokenInfo.item.brand;
    const { forSale, equippedTo, ...item } = wallet.item[0];
    const items = [];
    const testItem = {
      name: 'AirTox: Fairy Dust Elite',
      category: 'garment',
      functional: false,
      description:
        'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
      image:
        'https://ipfs.io/ipfs/QmShge9z81i5sRjgHUjH5EBwtKPvSRNap5JHbp4imLgJ4H',
      thumbnail:
        'https://ipfs.io/ipfs/QmdVLuhUPRvpHzmERTSsChHBexAhc6TUK6SPHsGnqQ7QaM',
      rarity: 65,
      level: 0,
      filtering: 0,
      weight: 0,
      sense: 0,
      reserves: 0,
      durability: 0,
      colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
      artistMetadata: '',
    };
    
    for(var i = 1; i<3; i++){
      items.push([{...item, name: item.name+" "+i}, BigInt(i)]);
    }
  
    marketService.sellItemBatch({
      itemCollection: items,
      pricePerItem: 100000000n,
      service: {
        kreadInstance: instance,
        itemBrand,
        makeOffer: service.walletConnection.makeOffer,
        istBrand: service.tokenInfo.ist,
      },
      callback: async () => {
        console.info("SellItem call settled");
      },
    });
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
        istBrand,
        makeOffer: service.walletConnection.makeOffer,
      },
      callback: async () => {
        console.info("BuyItem call settled");
      },
    });
  };

  const buttons = [
    { text: "STATE", onClick: () => console.log(service, wallet, userState) },
    { text: "MINT", onClick: mintCharacterAddOffer },
    { text: "UNEQUIP", onClick: unequipItemAddOffer },
    { text: "UNEQUIPALL", onClick: unequipAllAddOffer },
    { text: "EQUIP", onClick: equipItemAddOffer },
    { text: "SWAP", onClick: swapItemAddOffer },
    { text: "SELLCHAR", onClick: sellCharacterAddOffer },
    { text: "BUYCHAR", onClick: buyCharacterAddOffer },
    { text: "SELLITEM", onClick: sellItemAddOffer },
    { text: "SELLITEMBATCH", onClick: sellItemBatchAddOffer },
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
