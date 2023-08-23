import { makeCopyBag } from "@agoric/store";

interface MintCharacter {
  name: string;
  service: {
    kreadInstance: any;
    characterBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
}

export const mintCharacter = async ({ name, service, callback }: MintCharacter): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeMintCharacterInvitation",
  };

  const want = {
    Asset: { brand: charBrand, value: makeCopyBag(harden([[{ name: name }, 1n]])) },
  };

  const offerConfig = {
    spec,
    proposal: {
      want,
    },
  };

  service.makeOffer(offerConfig.spec, offerConfig.proposal, undefined, ({ status, data }: { status: string; data: object }) => {
    if (status === "error") {
      console.error("Offer error", data);
    }
    if (status === "refunded") {
      console.error("Offer refunded", data);
    }
    if (status === "accepted") {
      console.log("Offer accepted", data);
      callback();
    }
  });
};
