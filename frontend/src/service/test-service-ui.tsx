/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";

import { useCharacterContext } from "../context/characters";
import { useAgoricContext } from "../context/agoric";
import { equipItem, buyItem, mintItem, unequipItem, sellItem, itemSwap } from "./item-actions";
import { Item } from "../interfaces";

export const TestServiceUI = () => {
  // service referse to agoricContext
  const [service, ] = useAgoricContext();
  const [characters, ] = useCharacterContext();
  equipItem;
  const CBPublicFacet = service.contracts.characterBuilder.publicFacet;
  useEffect(() => {
    console.log("SERVICE:", service);
    console.log("CHARACTERS: ", characters);
  }, [service, characters]);

  const mintItemNFT = async () => {
    console.log(await mintItem(service));
  };

  const sellItemNFT = async () => {
    const item = service.purses.item[service.purses.item.length - 1].currentAmount.value[0];
    if (!item) return;

    await sellItem(service, item, 1n);
  };

  const buyItemNFT = async () => {
    const {
      contracts: {
        characterBuilder: { publicFacet },
      },
    } = service;
    const { items } = await E(publicFacet).getItemsMarket();
    if (!items.length) return;
    await buyItem(service, items[0]);
  };

  const addItemToInventory = async () => {
    const item = service.purses.item[service.purses.item.length - 1].currentAmount.value[0];
    const character = service.purses.character[service.purses.character.length - 1].currentAmount.value[0];
    console.log(item);
    console.log(character);
    await equipItem(service, item, character);
    console.log("done");
  };

  const removeItemFromInventory = async () => {
    const {
      items: equippedItems,
    } = await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters.owned[0].nft.name);

    const item = equippedItems[0];
    const character = characters.owned[0];
    console.log(item);
    console.log(character);
    await unequipItem(service, item, character.nft.name);
    console.log("done");
  };

  const test = async () => {
    
    // console.log(await E(service.contracts.characterBuilder.publicFacet).getCharacterKey("PABLO"));
    const { items: currentInventoryItems }: {items: Item[]} = await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory("CRISI");
    console.log(await itemSwap(service, currentInventoryItems[0], characters.owned[0].nft));
  };

  const getLogs = async () => {
    const privateState = await E(CBPublicFacet).getPrivateState();
    const keyLogs = await E(CBPublicFacet).getKeyLogs();

    console.log("🪙", privateState);
    console.log(keyLogs);
  };

  const getCharacterInventory = async () => {
    // const auctionPublicFacet = await E(service.agoric.zoe).getPublicFacet(auctionInstance);
    console.log("🥵>>>>> GETTING INVENTORY");
    if (!characters.owned[0].nft.name) {
      console.log("no characters owned");
      return;
    }
    console.log(await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters.owned[0].nft.name));
  };

  return (
    <>
      <h1>SERVICE TEST UI</h1>
      <div style={{ width: "100vw", height: "80vh", background: "#333", display: "flex", flexDirection: "row" }}>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={mintItemNFT}>
          MINT ITEM
        </button>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={sellItemNFT}>
          SELL ITEM
        </button>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={buyItemNFT}>
          BUY ITEM
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
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={test}>
          TEST
        </button>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={getLogs}>
          LOGS
        </button>
      </div>
    </>
  );
};
