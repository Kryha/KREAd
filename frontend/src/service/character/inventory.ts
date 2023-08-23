import { makeCopyBag } from "@agoric/store";
import { Character, Item } from "../../interfaces";

interface UnequipItem {
  item: Item;
  character: Character;
  service: {
    kreadInstance: any;
    characterBrand: any;
    itemBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
}
const unequipItem = async ({ item, character, service, callback }: UnequipItem): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const itemBrand = service.itemBrand;
  const wantKey = character.keyId == 2 ? 1 : 2;

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeUnequipInvitation",
  };

  const give = {
    CharacterKey1: { brand: charBrand, value: makeCopyBag([[character, 1n]]) },
  };

  const want = {
    CharacterKey2: {
      brand: charBrand,
      value: makeCopyBag([[{ ...character, keyId: wantKey }, 1n]]),
    },
    Item: {
      brand: itemBrand,
      value: makeCopyBag([[item, 1n]]),
    },
  };

  const offerConfig = {
    spec,
    proposal: {
      want,
      give,
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

interface UnequipAllItems {
  character: Character;
  service: {
    kreadInstance: any;
    characterBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
}
const unequipAll = async ({ character, service, callback }: UnequipAllItems): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const wantKey = character.keyId == 2 ? 1 : 2;

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeUnequipAllInvitation",
  };

  const give = {
    CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
  };

  const want = {
    CharacterKey2: {
      brand: charBrand,
      value: makeCopyBag(harden([[{ ...character, keyId: wantKey }, 1n]])),
    },
  };

  const offerConfig = {
    spec,
    proposal: {
      want,
      give,
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

interface EquipItem {
  item: Item;
  character: Character;
  service: {
    kreadInstance: any;
    characterBrand: any;
    itemBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
}
const equipItem = async ({ item, character, service, callback }: EquipItem): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const itemBrand = service.itemBrand;

  const wantKey = character.keyId == 2 ? 1 : 2;

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeEquipInvitation",
  };

  const give = {
    CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
    Item: { brand: itemBrand, value: makeCopyBag(harden([[item, 1n]])) },
  };

  const want = {
    CharacterKey2: {
      brand: charBrand,
      value: makeCopyBag(harden([[{ ...character, keyId: wantKey }, 1n]])),
    },
  };

  const offerConfig = {
    spec,
    proposal: {
      want,
      give,
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

interface SwapItems {
  giveItem: Item;
  wantItem: Item;
  character: Character;
  service: {
    kreadInstance: any;
    characterBrand: any;
    itemBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
}
const swapItems = async ({ giveItem, wantItem, character, service, callback }: SwapItems): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const itemBrand = service.itemBrand;

  const wantKey = character.keyId == 2 ? 1 : 2;

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeItemSwapInvitation",
  };

  const give = {
    CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[character, 1n]])) },
    Item1: { brand: itemBrand, value: makeCopyBag(harden([[giveItem, 1n]])) },
  };

  const want = {
    CharacterKey2: {
      brand: charBrand,
      value: makeCopyBag(harden([[{ ...character, keyId: wantKey }, 1n]])),
    },
    Item2: { brand: itemBrand, value: makeCopyBag(harden([[wantItem, 1n]])) },
  };

  const offerConfig = {
    spec,
    proposal: {
      want,
      give,
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

export const inventoryService = { unequipItem, equipItem, unequipAll, swapItems };
