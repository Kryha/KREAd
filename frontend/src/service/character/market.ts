import { makeCopyBag } from "@agoric/store";
import { Character } from "../../interfaces";
// TODO: Use makeOffer status callback for errors

interface CharacterMarketAction {
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

const sellCharacter = async ({ character, price, service, callback }: CharacterMarketAction): Promise<void> => {
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

  const proposal = {
    want,
    give,
    exit: { waived: null },
  };

  service.makeOffer(spec, proposal, undefined, ({ status, data }: { status: string; data: object }) => {
    if (status === "error") {
      console.error("Offer error", data);
    }
    if (status === "refunded") {
      console.error("Offer refunded", data);
      callback();
    }
    if (status === "accepted") {
      console.info("Offer accepted", data);
      callback();
    }
  });
};


const buyCharacter = async ({ character, price, service, callback }: CharacterMarketAction): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
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

  const proposal = {
    want,
    give,
  };

  service.makeOffer(spec, proposal, undefined, ({ status, data }: { status: string; data: object }) => {
    if (status === "error") {
      console.error("Offer error", data);
    }
    if (status === "refunded") {
      console.error("Offer refunded", data);
      callback();
    }
    if (status === "accepted") {
      console.info("Offer accepted", data);
      callback();
    }
  });
};

interface ItemMarketAction {
  item: any;
  price: bigint;
  service: {
    kreadInstance: any;
    itemBrand: any;
    istBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
}

const sellItem = async ({ item, price, service, callback }: ItemMarketAction): Promise<void> => {
  const instance = service.kreadInstance;

  const itemBrand = service.itemBrand;

  const spec = {
    id: "custom-id",
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

  const proposal = {
    want,
    give,
    exit: { waived: null },
  };

  console.log(give)
  service.makeOffer(spec, proposal, undefined, ({ status, data }: { status: string; data: object }) => {
    if (status === "error") {
      console.error("Offer error", data);
    }
    if (status === "refunded") {
      console.error("Offer refunded", data);
      callback();
    }
    if (status === "accepted") {
      console.info("Offer accepted", data);
      callback();
    }
  });
};

const buyItem = async ({ item, price, service, callback }: ItemMarketAction): Promise<void> => {
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

  const proposal = {
    want,
    give,
  };

  service.makeOffer(spec, proposal, undefined, ({ status, data }: { status: string; data: object }) => {
    if (status === "error") {
      console.error("Offer error", data);
    }
    if (status === "refunded") {
      console.error("Offer refunded", data);
      callback();
    }
    if (status === "accepted") {
      console.info("Offer accepted", data);
      callback();
    }
  });
};

export const marketService = { sellCharacter, buyCharacter, sellItem, buyItem };
