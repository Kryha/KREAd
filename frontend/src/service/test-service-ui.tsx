/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";

import { useAgoricContext } from "../context/agoric";
// import { equipItem, mintItem } from "./item-actions";
// import { buyCharacter, sellCharacter } from "./character-actions";
import { useCharacterMarketState } from "../context/character-shop";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { useUserState } from "../context/user";
import { useWalletState } from "../context/wallet";

export const TestServiceUI = () => {
  // service referse to agoricContext
  const [service,] = useAgoricContext();
  const { characters } = useUserState();
  const shop = useCharacterMarketState();
  console.log("---------------TESTUI", shop);
  const publicFacet = service.contracts.characterBuilder.publicFacet;

  // const getMarketCharacters = async () => {
  //   const charactersInMarket = await E(service.contracts.characterBuilder.publicFacet).getForsalezArray();
  //   console.log(charactersInMarket);
  //   console.log(charactersInMarket[0].character);

  // };

  // getMarketCharacters();
  // const CBPublicFacet = service.contracts.characterBuilder.publicFacet;
  useEffect(() => {
    console.log("SERVICE:", service);
    console.log("CHARACTERS: ", characters);
  }, [service, characters]);

  const mintItemNFT = async () => {
    console.log("temp");
    // console.log(await mintItem(service));
  };

  // const sellItemNFT = async () => {

  //   const item = service.purses.item[service.purses.item.length - 1].currentAmount.value[0];
  //   if (!item) return;

  //   await sellItem(service, item, 1n);
  // };
  
  const handleSellCharacter = async () => {
    const character = purses.character[purses.character.length - 1].currentAmount.value[0];
    if (!character) return;
    console.log("/////////////SELLING CHARACTER :", character);
    // await sellCharacter(service, character, 4n);
  };
  const handleBuyCharacter = async () => {
    if (!service) return;
    const characters = await E(publicFacet).getForsalezArray();
    const character = characters[characters.length - 1].character;
    console.log("/////////////BUYING CHARACTER :", character);
    // await buyCharacter(service, character, 4n);
  };
  
  // const buyItemNFT = async () => {
  //   const {
  //     contracts: {
  //       characterBuilder: { publicFacet },
  //     },
  //   } = service;
  //   const { items } = await E(publicFacet).getItemsMarket();
  //   if (!items.length) return;
  //   await buyItem(service, items[0]);
  // };
  const purses = useWalletState();

  const topUp = async () => {

    const invitation = await E(publicFacet).makeTokenFacetInvitation();
    const tokenPurse = purses.token;
    if (!tokenPurse) return;
    console.log(await E(service.agoric.walletP).addOffer(
      harden({
        id: Date.now().toString(),
        invitation: invitation,
        proposalTemplate: {
          want: {
            Token: {
              pursePetname: tokenPurse.pursePetname,
              value: 100n,
            },
          },
          dappContext: true,
        },
      })
    ));
  };
  const addItemToInventory = async () => {
    // const item = service.purses.item[service.purses.item.length - 1].currentAmount.value[0];
    // const character = service.purses.character[service.purses.character.length - 1].currentAmount.value[0];
    // console.log(item);
    // console.log(character);
    // await equipItem(service, item, character);
    console.log("done");
  };

  const removeItemFromInventory = async () => {
    const { items: equippedItems } = await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(
      characters[0].nft.name
    );

    const item = equippedItems[0];
    const character = characters[0];
    console.log(item);
    console.log(character);
    // await unequipItem(service, item, character.nft.name);
    console.log("done");
  };

  const test = async () => {
    
    const characters = E(service.contracts.characterBuilder.publicFacet).getCharacters();
    console.log(characters);
   
    const notifier = characters.characters[0].notifier;
    console.log(notifier);
    for await (const update of iterateNotifier(notifier)) {
      console.log("NOTIFIER UPDATE");
      console.log(update);
    }
    // const { items: currentInventoryItems }: {items: Item[]} = await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory("CRISI");
    // console.log(await itemSwap(service, currentInventoryItems[0], characters.owned[0].nft));
  };

  const getCharacterInventory = async () => {
    // const auctionPublicFacet = await E(service.agoric.zoe).getPublicFacet(auctionInstance);
    console.log("🥵>>>>> GETTING INVENTORY");
    if (!characters[0].nft.name) {
      console.log("no characters owned");
      return;
    }
    console.log(await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters[0].nft.name));
  };

  return (
    <>
      <h1>SERVICE TEST UI</h1>
      <div style={{ width: "100vw", height: "80vh", background: "#333", display: "flex", flexDirection: "row" }}>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={mintItemNFT}>
          MINT ITEM
        </button>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={handleSellCharacter}>
          SELL CHARACTER
        </button>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={handleBuyCharacter}>
          BUY CHARACTER
        </button>
        <button
          style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
          onClick={addItemToInventory}
        >
          ADD TO INVENTORY
        </button>
        <button
          style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
          onClick={removeItemFromInventory}
        >
          REMOVE FROM INVENTORY
        </button>
        <button
          style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
          onClick={async () => await getCharacterInventory()}
        >
          GET CHARACTER INVENTORY
        </button>
        <button
          style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
          onClick={() => console.log(characters)}
        >
          CHARACTERS
        </button>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={topUp}>
          TOP UP
        </button>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={test}>
          TEST
        </button>
      </div>
    </>
  );
};
