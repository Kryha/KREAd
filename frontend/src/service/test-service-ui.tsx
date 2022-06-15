/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";
import { useServiceContext } from "../context/service";
// import { getCardAuctionDetail, makeBidOfferForCard } from "./bid";
import { mintCharacter, mintCharacterZCF, mintNextCharacterZCF, mintNFT, makeBidOfferForCard } from "./mint";
import { AmountMath } from "@agoric/ertp";
import { useCharacterContext } from "../context/characters";
import { send } from "process";
import { FakeCharctersNoItems } from "./fake-characters";

export const TestServiceUI = () => {
  const [service, serviceDispatch] = useServiceContext();
  const [characters, charactersDispatch] = useCharacterContext();

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

  const handleMint = async () => {
    try {
      console.log("MINTINGGGG");
      console.log(service);
      const pricePerNFT = AmountMath.make(service.tokenPurses[0].brand, 1n);
      console.log(pricePerNFT);
      const newCharacters = harden([FakeCharctersNoItems[0]]);
      const mintResponse = await E(service.agoric.nftPublicFacet).auctionCharactersPublic(newCharacters, pricePerNFT);
      console.log(mintResponse);
    } catch (e) {
      console.log("ERROR");
      console.log(e);
    }
    // console.log(AmountMath.make(service.characterPurse.brand, [1n]));
    // callMintApi();
    // await mintNFT(service.agoric, service.tokenPurses, service.agoric.walletP);
    // await makeBidOfferForCard(
    //   service.agoric.walletP,
    //   nfts[0],
    //   service.agoric.publicFacet,
    //   service.characterPurse,
    //   service.tokenPurses,
    //   1,
    // );
  };

  const getTimer = () => {
    if (!service.apiSend) {
      console.log("NO API", service);
      return;
    }
    service.apiSend({
      type: "nft/getTimerService",
    });
    console.log("SENT GET TIMER");
  };
  
  const mint = () => {
    if (!service.apiSend) {
      console.log("NO API", service);
      return;
    }
    service.apiSend({
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
    if (!service.apiSend || !service.agoric.zoeInvitationDepositFacetId) {
      console.log("NO API / INVITATION", service);
      return;
    }
    console.log("CALLIN MINT CHARACTER...");
    // console.log(service.agoric.zoeInvitationDepositFacetId, service.tokenPurses[0].brand, service.characterPurse[0].brandPetname);
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
    service.apiSend({
      type: "character/mint",
      data: {
        depositFacetId: service.agoric.zoeInvitationDepositFacetId,
        offer,
      },
    });
  };
  
  const callMintApi =async () =>  {
    if (!service.apiSend || !service.agoric.zoeInvitationDepositFacetId) {
      console.log("NO API / INVITATION", service);
      return;
    }
    console.log("CALLIN MINT ...");
    // console.log(service.agoric.zoeInvitationDepositFacetId, service.tokenPurses[0].brand, service.characterPurse.brand);
    const moneyBrand = service.tokenPurses[0].brandPetname;
    const pricePerNFT = {
      brand: moneyBrand,
      value: 1+1,
    };
    const nftAmount = {
      brand: service.characterPurse.brandPetname[1],
      value:[{ id: 1 }],
    };

    // const nftAmount = AmountMath.make(service.characterPurse.brand, harden([{ id: 1n }]));

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

    service.apiSend({
      type: "character/mint",
      data: {
        depositFacetId: service.agoric.zoeInvitationDepositFacetId,
        offer: proposal,
      },
    });
    console.log("SENT");
  };


  const getCharacters = async () => {
    const nfts = await E(service.agoric.nftPublicFacet).getCharacterArray();
    charactersDispatch({ type: "SET_CHARACTERS", payload: nfts });
  };

  const setMintNext = async () => {
    await E(service.agoric.nftPublicFacet).setMintNext("c-los");
    console.log("done");
  };

  const test = async () => {
    const nfts = await E(service.agoric.nftPublicFacet).getCharacterArray();
    const counter = await E(service.agoric.nftPublicFacet).getCount();
    const config = await E(service.agoric.nftPublicFacet).getConfig();

    console.log(nfts, counter, config);
    const character = nfts[2];
    if (!character) {
      console.log("Character not found");
      return;
    }
    console.log(character);
    await makeOffer(character);
  };

  const makeOffer = async (character: any) => {
    // const auctionPublicFacet = await E(service.agoric.zoe).getPublicFacet(auctionInstance);
    console.log("🥵>>>>> AUCTION PUBLIC FACET");
    console.log(character.auction.publicFacet);
    await makeBidOfferForCard(service, character.auction.publicFacet, character.character, 10);
  };
  return <>
    <h1>SERVICE TEST UI</h1>
    <div style={{width: "100vw", height: "80vh", background: "#333", display: "flex", flexDirection: "row"}}>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={getTimer}>GET TIMER</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={handleMint}>CREATE CHARACTER</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={async ()=> await mintCharacterZCF(service.characterPurse[1].brandPetname, service.agoric)}>MINT VIA PUBLIC FACET</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={async ()=> await mintNextCharacterZCF(service.characterPurse[1].brandPetname, service.agoric, "c-los")}>MINT VIA PUBLIC FACET</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={async () => await getCharacters()}>GET CHARACTERS</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={() => console.log(characters)}>CHARACTERS</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={test}>TEST</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={setMintNext}>SET MINT NEXT</button>
    </div>
  </>;
};