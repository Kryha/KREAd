export const apiRecv = (obj: any, args: any) => {
  const { characterDispatch } = args;
  switch (obj.type) {
    case "nft-maker/nftTestResponse": {
      console.info("GOT CHARACTERS:");
      console.info(obj.data);
      characterDispatch({ type: "SET_CHARACTERS", payload: obj.data });
      return obj.data;
    }
    case "nft-maker/nftListResponse": {
      console.info("GOT CHARACTERS:");
      console.info(obj.data);
      characterDispatch({ type: "SET_CHARACTERS", payload: obj.data });
      return obj.data;
    }
    case "nft-maker/nftMintResponse": {
      console.info("MINT RESPONSE");
      console.info(obj.data);
      return obj.data;
    }
    case "response/character/mint": {
      console.info("~MINT RESPONSE");
      console.info(obj.data);
      return obj.data;
    }
    case "nftFaucet/sendInvitationResponse": {
      // Once the invitation has been sent to the user, we update the
      // offer to include the invitationBoardId. Then we make a
      // request to the user's wallet to send the proposed offer for
      // acceptance/rejection.
      const { offer } = obj.data;
      console.info("OFFER INCOMING: ", offer);
      // eslint-disable-next-line no-use-before-define
      // addOffer(offer);
      break;
    }
    case "CTP_DISCONNECT": {
      // TODO: handle this appropriately
      break;
    }
    default: {
      throw Error(`unexpected apiRecv obj.type ${obj.type}`);
    }
  }
};
