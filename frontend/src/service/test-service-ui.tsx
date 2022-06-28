/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";
import { useServiceContext } from "../context/service";
import { makeBidOfferForCharacter, getCharacters, mintCharacters, makeOfferForCharacter, mintViaDepositFacet, mintNfts } from "./character-actions";
// import { mintCharacter, mintCharacterZCF, mintNextCharacterZCF, mintNFT, makeBidOfferForCard } from "./mint";
import { AmountMath } from "@agoric/ertp";
import { useCharacterContext } from "../context/characters";
import { send } from "process";
import { FakeCharctersNoItems } from "./fake-characters";

export const TestServiceUI = () => {
  const [service, serviceDispatch] = useServiceContext();
  const [characters, charactersDispatch] = useCharacterContext();

  const CBPublicFacet = service.contracts.characterBuilder.publicFacet;
  useEffect(() => {
    console.log("SERVICE:", service);
    console.log("CHARACTERS: ", characters);
  }, [service, characters]);

  const nfts = [{
    name: "Tsun Tsun!",
    url: "https://ca.slack-edge.com/T4P05TL1F-U01E63R6WM7-611299dd1870-512",
  },{
    name: "Cmoney!",
    url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
  }];

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
  
  const mint = () => {
    if (!service.agoric.apiSend) {
      console.log("NO API", service);
      return;
    }
    service.agoric.apiSend({
      type: "nft/mint",
      data: {
        characters: [{
          name: "NOPE",
          url: "https://ca.slack-edge.com/T4P05TL1F-U01E63R6WM7-611299dd1870-512",
        },
        {
          name: "WHY",
          url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
        }],
      }
    });
    console.log("SENT GET CHARACTERS");
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
            pursePetname:  ["CHARACTER", "CB"],
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
  
  const callMintApi =async () =>  {
    if (!service.agoric.apiSend || !service.agoric.zoeInvitationDepositFacetId) {
      console.log("NO API / INVITATION", service);
      return;
    }
    console.log("CALLIN MINT ...");
    // console.log(service.agoric.zoeInvitationDepositFacetId, service.purses.money[0].brand, service.purses.character.brand);
    const moneyBrand = service.purses.money[0].brandPetname;
    const pricePerNFT = {
      brand: moneyBrand,
      value: 1+1,
    };
    const nftAmount = {
      brand: service.purses.character[1].brandPetname[1],
      value:[{ id: 1 }],
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
    const ownedCharacters = service.purses.character.map((purse) => {
      return purse.value;
    });
    console.log(service.purses.character, ownedCharacters);
    charactersDispatch({ type: "SET_OWNED_CHARACTERS", payload: ownedCharacters });
  };
  const getCharacters = async () => {
    const nfts = await E(CBPublicFacet).getCharacterArray();
    charactersDispatch({ type: "SET_CHARACTERS", payload: nfts });
  };
  

  const setMintNext = async () => {
    await E(CBPublicFacet).setMintNext("c-los");
    console.log("done");
  };

  const test = async () => {
    const nfts = await E(CBPublicFacet).getCharacters();
    const counter = await E(CBPublicFacet).getCount();
    const config = await E(CBPublicFacet).getConfig();
    const mintNext = await E(CBPublicFacet).getMintNext();
    console.log(nfts, counter, config, mintNext);
    // const character = nfts[2];
    // if (!character) {
    //   console.log("Character not found");
    //   return;
    // }
    // console.log(character);
    // await mintViaDepositFacet(service, "Pablo");
    console.log(await mintNfts(service, "PABLO", 10n));
  };

  const buyCharacter = async (characterIndex: number) => {
    // const auctionPublicFacet = await E(service.agoric.zoe).getPublicFacet(auctionInstance);
    console.log("🥵>>>>> AUCTION PUBLIC FACET");
    const nfts = await E(service.contracts.characterBuilder.publicFacet).getCharacterArray();
    const character = nfts[characterIndex];
    console.log(character.auction.publicFacet);
    await makeBidOfferForCharacter(service, character.auction.publicFacet, character.character, 10n);
  };

  const makeOffer = async (character: any) => {
    // const auctionPublicFacet = await E(service.agoric.zoe).getPublicFacet(auctionInstance);
    console.log("🥵>>>>> AUCTION PUBLIC FACET");
    console.log(character.auction.publicFacet);
    await makeBidOfferForCharacter(service, character.auction.publicFacet, character.character, 10n);
  };

  return <>
    <h1>SERVICE TEST UI</h1>
    <div style={{width: "100vw", height: "80vh", background: "#333", display: "flex", flexDirection: "row"}}>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={getTimer}>GET TIMER</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={()=>mintCharacters(service, [FakeCharctersNoItems[0], FakeCharctersNoItems[1]], 1n)}>CREATE CHARACTER</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={checkOwned}>CHECK MY CHARACTERS</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={async ()=> await buyCharacter(3)}>BUY CHARACTER</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={async () => await makeOfferForCharacter(service,"CLOS")}>GET CHARACTERS</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={() => console.log(characters)}>CHARACTERS</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={test}>TEST</button>
    </div>
  </>;
};