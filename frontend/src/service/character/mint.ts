import { MINTING_COST } from "../../constants";

// TODO: Use makeOffer status callback for errors

interface MintCharacter {
  name: string;
  service: {
    kreadInstance: any;
    istBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
  errorCallback?: (error: string) => void;
}

export const mintCharacter = async ({ name, service, callback, errorCallback }: MintCharacter): Promise<void> => {
  const instance = service.kreadInstance;
  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeMintCharacterInvitation",
  };

  const offerArgs = {
    name: name,
  };

  const give = { Price: { brand: service.istBrand, value: BigInt(MINTING_COST) } };

  const proposal = {
    give,
  };

  service.makeOffer(spec, proposal, offerArgs, ({ status, data }: { status: string; data: object }) => {
    if (status === "error") {
      console.error("Offer error", data);
      if(errorCallback) errorCallback(JSON.stringify(data));
    }
    if (status === "refunded") {
      console.error("Offer refunded", data);
    }
    if (status === "accepted") {
      console.info("Offer accepted", data);
      callback();
    }
  });
};
