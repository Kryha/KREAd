/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";
import dappConstants from "../service/conf/defaults";
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

  console.log("---------------TESTUI", service.addOffer, service.walletConnection);
  const publicFacet = service.contracts.characterBuilder.publicFacet;
  const {
    INSTANCE_NFT_MAKER_BOARD_ID,
    // INSTALLATION_BOARD_ID,
    // issuerBoardIds: { Character: CHARACTER_ISSUER_BOARD_ID, Item: ITEM_ISSUER_BOARD_ID, Token: TOKEN_ISSUER_BOARD_ID },
  } = dappConstants;

  useEffect(() => {
    console.log("SERVICE:", service);
    console.log("CHARACTERS: ", characters);
  }, [service, characters]);

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

  const purses = useWalletState();

  const topUp = async () => {
    // const invitation = await E(publicFacet).makeTokenFacetInvitation();
    // const tokenPurse = purses.token;

    const serializedInstance = await E(service.walletConnection.unserializer).serialize(INSTANCE_NFT_MAKER_BOARD_ID);
    // if (!tokenPurse) return;

    const offer = harden({
      publicInvitationMaker: "topUp",
      instanceHandle: serializedInstance,
      proposalTemplate: {
        want: {
          Token: {
            pursePetname: "KREAdTOKEN",
            value: 1000,
          },
        },
        dappContext: true,
      },
    });

    console.log(service.addOffer(offer));
    // console.log(await E(service.agoric.walletP).addOffer(offer))
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
    const powers = await E(publicFacet).getCount();
    console.log(powers);
  };

  const getCharacterInventory = async () => {
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
    align-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 30px;
    padding: 0 30vw;
  `;

  const Title = styled.h1`
    width: 500px;
    text-align: center;
    margin-top: 200px;
  `;

  const Button = styled.button`
    margin: 30px 15px 0;
    flex-basis: 220px;
    border-radius: 4px;
    height: 40px;
    width: 300px;
    background: transparent;
    border: #81ffad solid 4px;
    color: #81ffad;
    font-weight: light;
    cursor: pointer;

    &:hover {
      background: #86f4ad;
    }

    &:active {
      box-shadow: inset 1px 1px 10px #333;
      background: #76d397;
    }
  `;

  return (
    <>
      <Container>
        <Title>🔧</Title>
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
