import React, { useEffect } from "react";
import { useServiceContext } from "../context/service";
import { getCardAuctionDetail, makeBidOfferForCard } from "./bid";
import { mintCharacter } from "./mint";

export const TestServiceUI = () => {
  const [service, serviceDispatch] = useServiceContext();

  useEffect(() => {
    console.log("SERVICE:", service);
    

  }, [service]);

  const nfts = [{
    name: "Tsun Tsun!",
    url: "https://ca.slack-edge.com/T4P05TL1F-U01E63R6WM7-611299dd1870-512",
  },{
    name: "Cmoney!",
    url: "https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512",
  }];

  const handleMint = async () => {
    console.log("MINTINGGGG");
    await makeBidOfferForCard(
      service.agoric.walletP,
      nfts[0],
      service.agoric.publicFacet,
      service.characterPurse,
      service.tokenPurses,
      1,
    );
  };

  const getCharacter = async () => {
    console.log("GETTTTT");
    await getCardAuctionDetail(service.agoric.publicFacet, nfts[0]);
  };

  return <>
    <h1>SERVICE TEST UI</h1>
    <div style={{width: "100vw", height: "80vh", background: "#333", display: "flex", flexDirection: "row"}}>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={handleMint}>BID</button>
      <button
        style={{ height: "30px", width: "200px", borderRadius: "4px", background: "#81ffad", color: "#333" }}
        onClick={handleMint}>GET INFO</button>
    </div>
  </>;
};