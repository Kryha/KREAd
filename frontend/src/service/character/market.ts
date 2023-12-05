import { makeCopyBag } from "@agoric/store";
import { Character, Item, MakeOfferCallback } from "../../interfaces";
import { urlToCid } from "../../util/other";
import { formOfferResultCallback } from "../../util/contract-callbacks";

interface CharacterMarketAction {
  character: Character;
  price: bigint;
  service: {
    kreadInstance: any;
    characterBrand: any;
    istBrand: any;
    makeOffer: any;
  };
  callback: MakeOfferCallback;
}

const sellCharacter = async ({ character, price, service, callback }: CharacterMarketAction): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;

  const characterGive: Character = { ...character, id: Number(character.id), image: urlToCid(character.image) };

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeSellCharacterInvitation",
  };

  const give = {
    Character: { brand: charBrand, value: makeCopyBag(harden([[characterGive, 1n]])) },
  };

  const want = {
    Price: { brand: service.istBrand, value: price },
  };

  const proposal = {
    want,
    give,
  };

  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, undefined, formOfferResultCallback(callback));
};

const buyCharacter = async ({ character, price, service, callback }: CharacterMarketAction): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const istBrand = service.istBrand;

  const characterWant: Character = { ...character, id: Number(character.id), image: urlToCid(character.image) };

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeBuyCharacterInvitation",
  };

  const give = {
    Price: { brand: istBrand, value: price },
  };

  const want = {
    Character: { brand: charBrand, value: makeCopyBag(harden([[characterWant, 1n]])) },
  };

  const proposal = {
    want,
    give,
  };

  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, undefined, formOfferResultCallback(callback));
};

interface ItemMarketAction {
  entryId?: string;
  item: any;
  price: bigint;
  service: {
    kreadInstance: any;
    itemBrand: any;
    istBrand: any;
    makeOffer: any;
  };
  callback: MakeOfferCallback;
}

const sellItem = async ({ item, price, service, callback }: ItemMarketAction): Promise<void> => {
  const instance = service.kreadInstance;
  const itemBrand = service.itemBrand;

  const itemGive: Item = {
    ...item,
    image: urlToCid(item.image),
    thumbnail: urlToCid(item.thumbnail),
  };

  const spec = {
    id: "custom-id",
    source: "contract",
    instance,
    publicInvitationMaker: "makeSellItemInvitation",
  };

  const give = {
    Item: { brand: itemBrand, value: makeCopyBag(harden([[itemGive, 1n]])) },
  };

  const want = {
    Price: { brand: service.istBrand, value: price },
  };

  const proposal = {
    want,
    give,
  };
  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, undefined, formOfferResultCallback(callback));
};

interface SellItemBatchAction {
  entryId?: string;
  itemCollection: any;
  pricePerItem: bigint;
  service: {
    kreadInstance: any;
    itemBrand: any;
    istBrand: any;
    makeOffer: any;
  };
  callback: () => Promise<void>;
}

const sellItemBatch = async ({ itemCollection, pricePerItem, service, callback }: SellItemBatchAction): Promise<void> => {
  console.error("This feature is not implemented yet :)");
  return;

  const instance = service.kreadInstance;

  const spec = {
    id: "custom-id",
    source: "contract",
    instance,
    publicInvitationMaker: "makePublishItemCollectionInvitation",
  };

  const want = {
    Price: { brand: service.istBrand.brand, value: pricePerItem },
  };

  const proposal = {
    want,
    give: {},
  };

  service.makeOffer(spec, proposal, harden({ itemsToSell: itemCollection }), ({ status, data }: { status: string; data: object }) => {
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

const buyItem = async ({ entryId, item, price, service, callback }: ItemMarketAction): Promise<void> => {
  if (!entryId) return;

  const itemWant: Item = {
    ...item,
    image: urlToCid(item.image),
    thumbnail: urlToCid(item.thumbnail),
  };

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
    Item: { brand: itemBrand, value: makeCopyBag(harden([[itemWant, 1n]])) },
  };

  const proposal = {
    want,
    give,
  };
  if( callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, { entryId: Number(entryId) }, formOfferResultCallback(callback));
};

export const marketService = { sellCharacter, buyCharacter, sellItem, sellItemBatch, buyItem };
