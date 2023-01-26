/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";

import { useAgoricContext } from "../context/agoric";
import { useCharacterMarketState } from "../context/character-shop";
import { makeAsyncIterableFromNotifier as iterateNotifier } from "@agoric/notifier";
import { useUserState } from "../context/user";
import { useWalletState } from "../context/wallet";
import { useCreateCharacter } from "./character";
import styled from "@emotion/styled";

export const TestServiceUI = () => {
  const [service] = useAgoricContext();
  const { characters } = useUserState();
  const shop = useCharacterMarketState();
  const createCharacter = useCreateCharacter();

  console.log("---------------TESTUI", shop);
  const publicFacet = service.contracts.characterBuilder.publicFacet;

  useEffect(() => {
    console.log("SERVICE:", service);
    console.log("CHARACTERS: ", characters);
  }, [service, characters]);

  const mintCharacterNFT = async () => {
    await createCharacter.mutateAsync({ name: (Math.random() + 1).toString(36).substring(7) }); // random 5 char string
  };

  const purses = useWalletState();

  const topUp = async () => {
    const invitation = await E(publicFacet).makeTokenFacetInvitation();
    const tokenPurse = purses.token;

    if (!tokenPurse) return;

    console.log(
      await E(service.agoric.walletP).addOffer(
        harden({
          id: Date.now().toString(),
          invitation: invitation,
          proposalTemplate: {
            want: {
              Token: {
                pursePetname: tokenPurse.pursePetname,
                value: 1000n,
              },
            },
            dappContext: true,
          },
        })
      )
    );
  };

  const removeItemFromInventory = async () => {
    const { items: equippedItems } = await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters[0].nft.name);

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
  };

  const getCharacterInventory = async () => {
    console.log("🥵>>>>> GETTING INVENTORY");
    if (!characters[0].nft.name) {
      console.log("no characters owned");
      return;
    }
    console.log(await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters[0].nft.name));
  };

  const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: #333;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: space-between;
  `;

  const Button = styled.button`
    height: 25%;
    gap: 10px;
    width: 200px;
    border-radius: 4px;
    background: #81ffad;
    color: #333;
    font-weight: bold;
    cursor: pointer;

    &:active {
      box-shadow: inset 1px 1px 10px #333;
      background: #76d397;
    }
  `;

  return (
    <>
      <h1>SERVICE TEST UI</h1>
      <Container>
        <Button onClick={mintCharacterNFT}>MINT CHARACTER</Button>
        <Button onClick={topUp}>TOP UP</Button>
        <Button onClick={removeItemFromInventory}>REMOVE FROM INVENTORY</Button>
        <Button onClick={async () => await getCharacterInventory()}>GET CHARACTER INVENTORY</Button>
        <Button onClick={() => console.log(characters)}>CHARACTERS</Button>
        <Button onClick={test}>TEST</Button>
      </Container>
    </>
  );
};
