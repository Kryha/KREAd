/// <reference types="ses"/>
import { E } from "@endo/eventual-send";

import dappConstants from "../service/conf/defaults";
import { AgoricState } from "../interfaces/agoric.interfaces";
import { inter } from "../util";
import { ActivityEvent, Character, Item, ItemBackend, ItemInMarketBackend } from "../interfaces";
import { formatIdAsNumber } from "./util";
import { EVENT_TYPE } from "../constants";

export const sellItem = async (service: AgoricState, item: ItemBackend, price: bigint) => {
  const {
    contracts: {
      characterBuilder: { publicFacet },
    },
    agoric: { walletP, board, zoe },
    purses,
  } = service;

  if (!publicFacet) return;

  const itemPurse = purses.item[purses.item.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!itemPurse || !moneyPurse) return;

  const sellAssetsInstallation = await E(board).getValue(dappConstants.SELL_ASSETS_INSTALLATION_BOARD_ID);
  const itemIssuer = await E(publicFacet).getItemIssuer();
  const { moneyIssuer } = await E(publicFacet).getConfig();

  const issuerKeywordRecord = harden({
    Items: itemIssuer,
    Money: moneyIssuer,
  });

  const brandKeywordRecord = harden({
    Items: itemPurse.brand,
    Money: moneyPurse.brand,
  });
  
  const sellAssetsTerms = harden({
    pricePerItem: { value: price, brand: moneyPurse.brand },
    issuers: issuerKeywordRecord,
    brands: brandKeywordRecord,
  });

  const {
    creatorInvitation,
    instance,
    publicFacet: sellAssetsPublicFacet,
  } = await E(zoe).startInstance(sellAssetsInstallation, issuerKeywordRecord, sellAssetsTerms);

  await E(walletP).addOffer(
    harden({
      id: Date.now().toString(),
      invitation: creatorInvitation,
      proposalTemplate: {
        want: {
          Money: {
            pursePetname: moneyPurse.pursePetname,
            value: inter(price),
          },
        },
        give: {
          Items: {
            pursePetname: itemPurse.pursePetname,
            value: [item],
          },
        },
        exit: { waived: null },
      },
      dappContext: true,
    })
  );

  const itemInMarket = {
    id: item.id,
    item,
    sell: { instance, publicFacet: sellAssetsPublicFacet, price },
  };

  return itemInMarket;
};

export const buyItem = async (service: AgoricState, itemInMarket: ItemInMarketBackend) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;

  if (!publicFacet || !walletP) return;

  const itemPurse = purses.item[purses.item.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!itemPurse || !moneyPurse) return;

  const { sell, item } = itemInMarket;

  const invitation = await E(sell.publicFacet).makeBuyerInvitation();

  await E(walletP).addOffer(
    harden({
      id: Date.now().toString(),
      invitation,
      proposalTemplate: {
        want: {
          Items: {
            pursePetname: itemPurse.pursePetname,
            value: [item],
          },
        },
        give: {
          Money: {
            pursePetname: moneyPurse.pursePetname,
            value: inter(sell.price),
          },
        },
      },
      dappContext: true,
    })
  );
};

// TODO: Add price for minting // price?: bigint
// TODO: Ensure this fn does not work in prod
export const mintItem = async (service: AgoricState, item?: any) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;

  if (!publicFacet || !walletP || !purses.item[0].pursePetname) {
    console.error("undefined parameter");
    return;
  }

  const config = await E(publicFacet).getConfig();
  const defaultItems = Object.values(config.defaultItems);
  const itemsToMint = item ? [item] : defaultItems;

  const uniqueItems = itemsToMint.map((item: any) => {
    return { ...item, name: `${item.name} (ESPECIAL EDITION)` };
  });

  const invitation = await E(publicFacet).makeMintItemInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Item: {
          pursePetname: service.purses.item[service.purses.item.length - 1].brandPetname,
          value: uniqueItems,
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};

export const equipItem = async (service: AgoricState, item: Item, character: Character) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
  } = service;

  const itemPurse = service.purses.item[service.purses.item.length - 1];
  const characterPurse = service.purses.character[service.purses.character.length - 1];
  const inventoryCharacter = await E(publicFacet).getCharacterKey(character.name); //{ ...character, keyId: BigInt(character.keyId === 1 ? 2 : 1) };
  const wantedCharacter = inventoryCharacter.key.value[0];

  if (!publicFacet || !walletP || !itemPurse || !wantedCharacter) {
    console.error("undefined parameter");
    return;
  }

  const { items: currentInventoryItems }: { items: Item[] } = await E(publicFacet).getCharacterInventory(character.name);
  const filledCategories = currentInventoryItems.map((i) => i.category);

  if (filledCategories.includes(item.category)) {
    console.info("Existing item in seleted category, performing swap");
    itemSwap(service, item, character);
    return;
  }
  const invitation = await E(publicFacet).makeEquipInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        Item: {
          pursePetname: itemPurse.brandPetname,
          value: [formatIdAsNumber(item)],
        },
        CharacterKey1: {
          pursePetname: characterPurse.brandPetname,
          value: [formatIdAsNumber(character)],
        },
      },
      want: {
        CharacterKey2: {
          pursePetname: characterPurse.brandPetname,
          value: [formatIdAsNumber(wantedCharacter)],
        },
      },
    },
    dappContext: true,
  });

  return E(walletP).addOffer(offerConfig);
};

export const unequipItem = async (service: AgoricState, item: Item, characterName: string) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
  } = service;

  const itemPurse = service.purses.item[service.purses.item.length - 1];
  const characterPurse = service.purses.character[service.purses.character.length - 1];
  const characterInPurse = characterPurse.value.find((character: Character) => character.name === characterName);
  const inventoryCharacter = await E(publicFacet).getCharacterKey(characterName); //{ ...character, keyId: BigInt(character.keyId === 1 ? 2 : 1) };
  const wantedCharacter = inventoryCharacter.key.value[0];

  if (!publicFacet || !walletP || !itemPurse || !characterPurse || !wantedCharacter) {
    console.error("undefined parameter");
    return;
  }

  const invitation = await E(publicFacet).makeUnequipInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        CharacterKey1: {
          pursePetname: characterPurse.brandPetname,
          value: [formatIdAsNumber(characterInPurse)],
        },
      },
      want: {
        Item: {
          pursePetname: itemPurse.brandPetname,
          value: [formatIdAsNumber(item)],
        },
        CharacterKey2: {
          pursePetname: characterPurse.brandPetname,
          value: [formatIdAsNumber(wantedCharacter)],
        },
      },
    },
    dappContext: true,
  });

  return E(walletP).addOffer(offerConfig);
};

export const itemSwap = async (service: AgoricState, item: Item, character: Character) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
  } = service;

  const itemPurse = service.purses.item[service.purses.item.length - 1];
  const characterPurse = service.purses.character[service.purses.character.length - 1];
  const inventoryCharacter = await E(publicFacet).getCharacterKey(character.name); //{ ...character, keyId: BigInt(character.keyId === 1 ? 2 : 1) };
  const wantedCharacter = inventoryCharacter.key.value[0];
  const { items: currentInventoryItems }: { items: Item[] } = await E(publicFacet).getCharacterInventory(character.name);

  const availableItems: Item[] = itemPurse.value.map((item: Item) => formatIdAsNumber(item));
  const itemToSwapGive = availableItems.find((i) => i.category === item.category);
  const itemToSwapWant = currentInventoryItems.find((item: Item) => itemToSwapGive?.category === item.category);

  if (!publicFacet || !walletP || !itemPurse || !wantedCharacter) {
    console.error("undefined parameter");
    return;
  }

  const invitation = await E(publicFacet).makeItemSwapInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      give: {
        Item1: {
          pursePetname: itemPurse.brandPetname,
          value: harden([itemToSwapGive]),
        },
        CharacterKey1: {
          pursePetname: characterPurse.brandPetname,
          value: [formatIdAsNumber(character)],
        },
      },
      want: {
        Item2: {
          pursePetname: itemPurse.brandPetname,
          value: harden([itemToSwapWant]),
        },
        CharacterKey2: {
          pursePetname: characterPurse.brandPetname,
          value: [formatIdAsNumber(wantedCharacter)],
        },
      },
    },
    dappContext: true,
  });

  return E(walletP).addOffer(offerConfig);
};

export const getItemActivity = async (itemId: string, agoric: AgoricState): Promise<ActivityEvent[]> => {
  const fetchedActivity = await E(agoric.contracts.characterBuilder.publicFacet).getItemHistory(itemId);
  const itemActivity = fetchedActivity.map((event: any) => {
    if (event.type === EVENT_TYPE.mint) {
      return {
        type: event.type,
        date: event.timestamp,
      };
    } else {
      return {
        type: event.type,
        price: event.data.sell.price || 0,
        date: event.timestamp,
      };
    }
  });
  return itemActivity;
};
