import { MINTING_COST } from "../../constants";
import { MakeOfferCallback } from "../../interfaces";
import { formOfferResultCallback } from "../../util/contract-callbacks";

interface MintCharacter {
  name: string;
  service: {
    kreadInstance: any;
    istBrand: any;
    makeOffer: any;
  };
  callback: MakeOfferCallback;
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

  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, offerArgs, formOfferResultCallback(callback));
};
