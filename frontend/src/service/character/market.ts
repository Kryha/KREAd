import { makeCopyBag } from "@agoric/store";
import { Character, Item } from "../../interfaces";

interface SellCharacter {
    character: Character;
    price: bigint;
    service: {
      kreadInstance: any;
      characterBrand: any;
      istBrand: any;
      makeOffer: any;
    };
    callback: () => Promise<void>;
  }
const sellCharacter = async ({ character, price, service, callback }: SellCharacter): Promise<void> => {
    const instance = service.kreadInstance;
    const charBrand = service.characterBrand;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeSellCharacterInvitation",
    };

    const give = {
      Character: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
    };

    const want = {
      Price: { brand: service.istBrand, value: price },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
        exit: { waived: null },
      },
    };

    service.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
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
      }
    );
  };

  interface BuyCharacter {
    character: Character;
    price: BigInt;
    
    service: {
      kreadInstance: any;
      characterBrand: any;
      istBrand: any;
      makeOffer: any;
    };
    callback: () => Promise<void>;
  }
  const buyCharacter = async ({ character, price, service, callback }: BuyCharacter): Promise<void> => {
    const instance = service.kreadInstance
    const charBrand = service.characterBrand
    const istBrand = service.istBrand;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeBuyCharacterInvitation",
    };

    const give = {
      Price: { brand: istBrand, value: price },
    };

    const want = {
      Character: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
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
      }
    );
  };
  interface SellItem {
    item: Item;
    price: BigInt;
    service: {
      kreadInstance: any;
      itemBrand: any;
      istBrand: any;
      makeOffer: any;
    };
    callback: () => Promise<void>;
  }
  const sellItem = async ({ item, price, service, callback }: SellItem): Promise<void> => {
    const instance = service.kreadInstance

    const itemBrand = service.itemBrand;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeSellItemInvitation",
    };

    const give = {
      Item: { brand: itemBrand, value: makeCopyBag(harden([[item, 1n]])) },
    };

    const want = {
      Price: { brand: service.istBrand, value: price },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
        exit: { waived: null },
      },
    };

    service.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
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
      }
    );
  };
  interface BuyItem {
    item: Item;
    price: BigInt;
    service: {
      kreadInstance: any;
      itemBrand: any;
      istBrand: any;
      makeOffer: any;
    };
    callback: () => Promise<void>;
  }
  const buyItem = async ({ item, price, service, callback }: BuyItem): Promise<void> => {
    const instance = service.kreadInstance;
    const itemBrand = service.itemBrand;
    const istBrand = service.istBrand;

    const spec = {
      source: "contract",
      instance,
      publicInvitationMaker: "makeBuyItemInvitation",
    };

    const give = {
      Price: { brand: istBrand, value: price },
    };

    const want = {
      Item: { brand: itemBrand, value: makeCopyBag(harden([[{ ...item, id: Number(item.id) }, 1n]])) },
    };

    const offerConfig = {
      spec,
      proposal: {
        want,
        give,
      },
    };

    service.makeOffer(
      offerConfig.spec,
      offerConfig.proposal,
      undefined,
      ({ status, data }: { status: string; data: object }) => {
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
      }
    );
  };

  export const marketService = { sellCharacter, buyCharacter, sellItem, buyItem };
