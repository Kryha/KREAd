import { makeCopyBag } from "@agoric/store";
// TODO: Use makeOffer status callback for errors 

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

  const proposal = {
    want,
  };

  service.makeOffer(spec, proposal, undefined, ({ status, data }: { status: string; data: object }) => {
    if (status === "error") {
      console.error("Offer error", data);
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
