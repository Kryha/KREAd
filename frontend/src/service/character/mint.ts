import { MINTING_COST } from "../../constants";
import { HandleOfferResult } from "../../interfaces";

// TODO: Use makeOffer status callback for errors

interface MintCharacter {
  name: string;
  service: {
    kreadInstance: any;
    istBrand: any;
    makeOffer: any;
  };
  callback: HandleOfferResult;
}

export const mintCharacter = async ({ name, service, callback }: MintCharacter): Promise<void> => {
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
  console.log(callback)
  service.makeOffer(spec, proposal, offerArgs, callback);
};
