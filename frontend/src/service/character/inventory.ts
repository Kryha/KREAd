import { makeCopyBag } from "@agoric/store";
import { Character, Item, MakeOfferCallback } from "../../interfaces";
import { urlToCid } from "../../util/other";
import { formOfferResultCallback } from "../../util/contract-callbacks";

interface UnequipItem {
  item: any;
  character: Character;
  service: {
    kreadInstance: any;
    characterBrand: any;
    itemBrand: any;
    makeOffer: any;
  };
  callback: MakeOfferCallback;
}

const unequipItem = async ({ item, character, service, callback }: UnequipItem): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const itemBrand = service.itemBrand;
  const wantKey = character.keyId == 2 ? 1 : 2;
  const characterGive: Character = { ...character, id: Number(character.id), image: urlToCid(character.image) };
  const characterWant: Character = { ...character, id: Number(character.id), image: urlToCid(character.image), keyId: wantKey };
  const itemWant: Item = {
    ...item,
    image: urlToCid(item.image),
    thumbnail: urlToCid(item.thumbnail),
  };

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeUnequipInvitation",
  };

  const give = {
    CharacterKey1: { brand: charBrand, value: makeCopyBag([[characterGive, 1n]]) },
  };

  const want = {
    CharacterKey2: {
      brand: charBrand,
      value: makeCopyBag([[characterWant, 1n]]),
    },
    Item: {
      brand: itemBrand,
      value: makeCopyBag([[itemWant, 1n]]),
    },
  };

  const proposal = {
    want,
    give,
  };

  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, undefined, formOfferResultCallback(callback));
};

interface UnequipAllItems {
  character: Character;
  service: {
    kreadInstance: any;
    characterBrand: any;
    makeOffer: any;
  };
  callback: MakeOfferCallback;
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

  const proposal = {
    want,
    give,
  };

  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, undefined, formOfferResultCallback(callback));
};

interface EquipItem {
  item: any;
  character: Character;
  service: {
    kreadInstance: any;
    characterBrand: any;
    itemBrand: any;
    makeOffer: any;
  };
  callback: MakeOfferCallback;
}

const equipItem = async ({ item, character, service, callback }: EquipItem): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const itemBrand = service.itemBrand;

  const wantKey = character.keyId == 2 ? 1 : 2;
  const characterGive: Character = { ...character, id: Number(character.id), image: urlToCid(character.image) };
  const characterWant: Character = { ...character, id: Number(character.id), image: urlToCid(character.image), keyId: wantKey };
  const itemGive: Item = {
    ...item,
    image: urlToCid(item.image),
    thumbnail: urlToCid(item.thumbnail),
  };

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeEquipInvitation",
  };

  const give = {
    CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[characterGive, 1n]])) },
    Item: { brand: itemBrand, value: makeCopyBag(harden([[itemGive, 1n]])) },
  };

  const want = {
    CharacterKey2: {
      brand: charBrand,
      value: makeCopyBag(harden([[characterWant, 1n]])),
    },
  };

  const proposal = {
    want,
    give,
  };

  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, undefined, formOfferResultCallback(callback));
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
  callback: MakeOfferCallback;
}

const swapItems = async ({ giveItem, wantItem, character, service, callback }: SwapItems): Promise<void> => {
  const instance = service.kreadInstance;
  const charBrand = service.characterBrand;
  const itemBrand = service.itemBrand;

  const wantKey = character.keyId == 2 ? 1 : 2;
  const characterGive: Character = { ...character, id: Number(character.id), image: urlToCid(character.image) };
  const characterWant: Character = { ...character, id: Number(character.id), image: urlToCid(character.image), keyId: wantKey };
  const itemGive: Item = {
    ...giveItem,
    image: urlToCid(giveItem.image),
    thumbnail: urlToCid(giveItem.thumbnail),
  };
  const itemWant: Item = {
    ...wantItem,
    image: urlToCid(wantItem.image),
    thumbnail: urlToCid(wantItem.thumbnail),
  };

  const spec = {
    source: "contract",
    instance,
    publicInvitationMaker: "makeItemSwapInvitation",
  };

  const give = {
    CharacterKey1: { brand: charBrand, value: makeCopyBag(harden([[characterGive, 1n]])) },
    Item1: { brand: itemBrand, value: makeCopyBag(harden([[itemGive, 1n]])) },
  };

  const want = {
    CharacterKey2: {
      brand: charBrand,
      value: makeCopyBag(harden([[characterWant, 1n]])),
    },
    Item2: { brand: itemBrand, value: makeCopyBag(harden([[itemWant, 1n]])) },
  };

  const proposal = {
    want,
    give,
  };

  if (callback.setIsLoading) callback.setIsLoading(true);
  service.makeOffer(spec, proposal, undefined, formOfferResultCallback(callback));
};

export const inventoryService = { unequipItem, equipItem, unequipAll, swapItems };
