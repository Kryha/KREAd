/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";
import { mintNfts } from "./character-actions";
import { addToInventory, addToInventoryContinued, mintItem, removeFromInventory } from "./item-actions";

// import { mintCharacter, mintCharacterZCF, mintNextCharacterZCF, mintNFT, makeBidOfferForCard } from "./mint";
import { useCharacterContext } from "../context/characters";
// import { send } from "process";
// import { FakeCharctersNoItems } from "./fake-characters";
import { useAgoricContext } from "../context/agoric";
import { AgoricState } from "../interfaces/agoric.interfaces";

export const TestServiceUI = () => {
  // service referse to agoricContext
  const [service, agoricDispatch] = useAgoricContext();
  const [characters, charactersDispatch] = useCharacterContext();

  const CBPublicFacet = service.contracts.characterBuilder.publicFacet;
  useEffect(() => {
    console.log("SERVICE:", service);
    console.log("CHARACTERS: ", characters);
  }, [service, characters]);

  const getTimer = () => {
    if (!service.agoric.apiSend) {
      console.log("NO API", service);
      return;
    }
    service.agoric.apiSend({
      type: "nft/getTimerService",
    });
    console.log("SENT GET TIMER");
  };

  const mintItem = (agoric: AgoricState) => {
    console.log(agoric);
    //TODO: call mint
  };

  const mintCharacter = async () => {
    if (!service.agoric.apiSend || !service.agoric.zoeInvitationDepositFacetId) {
      console.log("NO API / INVITATION", service);
      return;
    }
    console.log("CALLIN MINT CHARACTER...");
    // console.log(service.agoric.zoeInvitationDepositFacetId, service.purses.money[0].brand, service.purses.character[0].brandPetname);
    const offer = {
      // JSONable ID for this offer.  This is scoped to the origin.
      id: Date.now(),

      proposalTemplate: {
        want: {
          Token: {
            pursePetname: ["CHARACTER", "CB"],
            value: 1,
          },
        },
      },

      // Tell the wallet that we're handling the offer result.
      dappContext: true,
    };
    service.agoric.apiSend({
      type: "character/mint",
      data: {
        depositFacetId: service.agoric.zoeInvitationDepositFacetId,
        offer,
      },
    });
  };

  const callMintApi = async () => {
    if (!service.agoric.apiSend || !service.agoric.zoeInvitationDepositFacetId) {
      console.log("NO API / INVITATION", service);
      return;
    }
    console.log("CALLIN MINT ...");
    // console.log(service.agoric.zoeInvitationDepositFacetId, service.purses.money[0].brand, service.purses.character.brand);
    const moneyBrand = service.purses.money[0].brandPetname;
    const pricePerNFT = {
      brand: moneyBrand,
      value: 1 + 1,
    };
    const nftAmount = {
      brand: service.purses.character[1].brandPetname[1],
      value: [{ id: 1 }],
    };

    // const nftAmount = AmountMath.make(service.purses.character.brand, harden([{ id: 1n }]));

    const proposal = harden({
      give: {
        Money: pricePerNFT,
      },
      want: {
        NFTs: nftAmount,
      },
    });

    /*
    const offer = {
      // JSONable ID for this offer.  This is scoped to the origin.
      id: Date.now(),

      proposalTemplate: {
        want: {
          Token: {
            pursePetname: tokenPursePetname,
            value: 1000,
          },
        },
      },

      // Tell the wallet that we're handling the offer result.
      dappContext: true,
    };
    */
    const payload = {
      type: "nftFaucet/sendInvitation",
      data: {
        depositFacetId: service.agoric.zoeInvitationDepositFacetId,
        offer: proposal,
      },
    };

    service.agoric.apiSend({
      type: "character/mint",
      data: {
        depositFacetId: service.agoric.zoeInvitationDepositFacetId,
        offer: proposal,
      },
    });
    console.log("SENT");
  };

  const checkOwned = () => {
    const ownedCharacters = service.purses.character.map((purse: any) => {
      return purse.value;
    });
    console.log(service.purses.character, ownedCharacters);
    charactersDispatch({ type: "SET_OWNED_CHARACTERS", payload: ownedCharacters });
  };

  const mintItemNFT = async () => {
    console.log(await mintItem(service));
  };

  const addItemToInventory = async () => {
    const item = service.purses.item[service.purses.item.length - 1].currentAmount.value[0];
    console.log(item);
    await addToInventory(service, item);
    console.log("done");
  };

  const removeItemFromInventory = async () => {
    const {
      items: { value: equippedItems },
    } = await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters.owned[0].name);

    const item = equippedItems[0];
    console.log(item);
    await removeFromInventory(service, item);
    console.log("done");
  };

  const test = async () => {
    // const inviteReturnMsg = await E(CBPublicFacet).testPRNG();
    // const config = await E(CBPublicFacet).getConfig();
    // const mintNext = await E(CBPublicFacet).getMintNext();

    /*
    const invitationMsg = await E(CBPublicFacet).invitationReturnMsg();
    const invitationParam1 = await E(CBPublicFacet).invitationParam1({ msg: "MY SECRET MSG" });
    const invitationParam2 = await E(CBPublicFacet).invitationParam2({ msg: "MY SECRET MSG" });

    console.info("Invitations successful, sending to wallet for approval", invitationMsg, invitationParam1, invitationParam2);

    const offerConfigMsg = harden({
      id: `${Date.now()}msg`,
      invitation: invitationMsg,
      proposalTemplate: {},
      dappContext: true,
    });
    const offerConfigParam1 = harden({
      id: `${Date.now()}p1`,
      invitation: invitationParam1,
      proposalTemplate: {},
      dappContext: true,
    });
    const offerConfigParam2 = harden({
      id: `${Date.now()}p2`,
      invitation: invitationParam2,
      proposalTemplate: {},
      dappContext: true,
    });
    const results = await Promise.allSettled([
      E(service.agoric.walletP).addOffer(offerConfigMsg),
      E(service.agoric.walletP).addOffer(offerConfigParam1),
      E(service.agoric.walletP).addOffer(offerConfigParam2),
    ]
    );

    console.log("🦐 ", results); */

    console.log(await mintNfts(service, "PABLO"));
    // const nfts = await E(CBPublicFacet).getCharacters();
    // const rand = await E(CBPublicFacet).testPRNG();
    // const config = await E(CBPublicFacet).getConfig();
    // const mintNext = await E(CBPublicFacet).getMintNext();
    // console.log(nfts, rand, config, mintNext);
    // console.log(await E(CBPublicFacet).getRandomBaseCharacter());
    // const character = nfts[2];
    // if (!character) {
    //   console.log("Character not found");
    //   return;
    // }
    // console.log(character);
    // await mintViaDepositFacet(service, "Pablo");
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
    if (!characters.owned[0].name) {
      console.log("no characters owned");
      return;
    }
    console.log(await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters.owned[0].name));
  };

  return (
    <>
      <h1>SERVICE TEST UI</h1>
      <div style={{ width: "100vw", height: "80vh", background: "#333", display: "flex", flexDirection: "row" }}>
        <button style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }} onClick={mintItemNFT}>
          MINT ITEM
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
