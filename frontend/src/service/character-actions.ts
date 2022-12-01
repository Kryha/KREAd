/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { AmountMath } from "@agoric/ertp";

import dappConstants from "../service/conf/defaults";
import { Purses, AgoricState } from "../interfaces/agoric.interfaces";
import { inter, mediate } from "../util";
import { CharacterBackend, CharacterInMarketBackend, ExtendedCharacterBackend, Item } from "../interfaces";
import { formatIdAsNumber, itemCategories } from "./util";

export const formOfferForCharacter = (purses: Purses, character: any) => ({
  want: {
    Asset: {
      pursePetname: purses.character[0].pursePetname,
      value: character,
    },
  },
  give: {
    Price: {
      pursePetname: purses.money[0].pursePetname,
      value: 10,
    },
  },
});

export const formOfferForCharacterAmount = (characterBrand: any, character: any, moneyBrand: any, price: bigint) => ({
  want: {
    Asset: AmountMath.make(characterBrand, [character]),
  },
  give: {
    Price: AmountMath.make(moneyBrand, price),
  },
});

export const extendCharacters = async (
  publicFacet: any,
  characters: CharacterBackend[]
): Promise<{ extendedCharacters: ExtendedCharacterBackend[]; equippedItems: Item[] }> => {
  const equippedCharacterItems: Item[] = [];

  const charactersWithItems: ExtendedCharacterBackend[] = await Promise.all(
    characters.map(async (character) => {
      const { items: equippedItems } = await E(publicFacet).getCharacterInventory(character.name);

      const frontendEquippedItems = mediate.items.toFront(equippedItems);

      equippedCharacterItems.push(...frontendEquippedItems);
      const equipped: { [key: string]: Item | undefined } = {};
      itemCategories.forEach((category) => {
        equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
      });

      return {
        nft: character,
        equippedItems: equipped,
      };
    })
  );

  return { extendedCharacters: charactersWithItems, equippedItems: equippedCharacterItems };
};

export const mintNfts = async (service: AgoricState, name: string) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;

  if (!publicFacet || !walletP || !purses.money[0].pursePetname || !purses.character[0].pursePetname) {
    console.error("Could not make bid for character: undefined parameter");
    return;
  }

  const invitation = await E(publicFacet).makeMintCharacterInvitation();

  console.info("Invitation successful, sending to wallet for approval");

  const offerConfig = harden({
    id: `${Date.now()}`,
    invitation: invitation,
    proposalTemplate: {
      want: {
        Asset: {
          pursePetname: service.purses.character[service.purses.character.length - 1].pursePetname,
          value: [{ name }],
        },
      },
    },
    dappContext: true,
  });
  return E(walletP).addOffer(offerConfig);
};

export const newSellCharacter = async (service: AgoricState, character: CharacterBackend, price: bigint) => {
  console.log("🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️ CALLING SELL CHARACTER 🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️🧝‍♀️");
  const {
    contracts: {
      characterBuilder: { publicFacet },
    },
    agoric: { walletP, board, zoe },
    purses,
  } = service;

  if (!publicFacet) return;
  const characterPurse = purses.character[purses.character.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];
  const character2sell = characterPurse.currentAmount.value[0];
  console.log(character2sell);
  if (!characterPurse || !moneyPurse) return;

  const sellInvitation = await E(publicFacet).makeSellCharacterInvitation();
  const offer = harden({
    id: Date.now().toString(),
    invitation: sellInvitation,
    proposalTemplate: {
      want: {
        Price: {
          pursePetname: moneyPurse.pursePetname,
          value: inter(price),
        },
      },
      give: {
        Character: {
          pursePetname: characterPurse.pursePetname,
          value: [formatIdAsNumber(character2sell)],
        },
      },
    },
    dappContext: true,
  });
  console.log(offer);
  return await E(walletP).addOffer(
    offer
  );
  // const characterInMarket = {
  //   id: character.id,
  //   character,
  //   sell: { instance, publicFacet: sellAssetsPublicFacet, price },
  // };

};

export const newBuyCharacter = async (service: AgoricState) => {
  const {
    contracts: {
      characterBuilder: { publicFacet },
    },
    agoric: { walletP, board, zoe },
    purses,
  } = service;

  if (!publicFacet) return;
  const characterPurse = purses.character[purses.character.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];
  const character2buy = {
    date: 2n,
    description: "A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.",
    detail: {
      artist: "emily",
      boardId: "06553",
      contractAddresss: "0x0177812bsjs7998",
      metadata: "https://yourmetadata.info",
      standard: "standard",
    },
    id: 1669218489n,
    image: "https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg",
    keyId: 1,
    level: 1,
    name: "CMONEY",
    projectDescription: "this is a project",
    title: "character 1",
    type: "tempetScavenger",
  };
  if (!characterPurse || !moneyPurse) return;

  const buyInvitation = await E(publicFacet).makeBuyInvitation();

  await E(walletP).addOffer(
    harden({
      id: Date.now().toString(),
      invitation: buyInvitation,
      proposalTemplate: {
        want: {
          Character: {
            pursePetname: characterPurse.pursePetname,
            value: [character2buy],
          },
        },
        give: {
          Money: {
            pursePetname: moneyPurse.pursePetname,
            value: inter(3n),
          },
        },
      },
      dappContext: true,
    })
  );

  // const characterInMarket = {
  //   id: character.id,
  //   character,
  //   sell: { instance, publicFacet: sellAssetsPublicFacet, price },
  // };

  console.log("PLACED FOR SALE");
};

export const sellCharacter = async (service: AgoricState, character: CharacterBackend, price: bigint) => {
  const {
    contracts: {
      characterBuilder: { publicFacet },
    },
    agoric: { walletP, board, zoe },
    purses,
  } = service;

  if (!publicFacet) return;

  const characterPurse = purses.character[purses.character.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!characterPurse || !moneyPurse) return;

  const sellAssetsInstallation = await E(board).getValue(dappConstants.SELL_ASSETS_INSTALLATION_BOARD_ID);
  const characterIssuer = await E(publicFacet).getCharacterIssuer();
  const { moneyIssuer } = await E(publicFacet).getConfig();

  const issuerKeywordRecord = harden({
    Items: characterIssuer,
    Money: moneyIssuer,
  });

  const brandKeywordRecord = harden({
    Items: characterPurse.brand,
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
            pursePetname: characterPurse.pursePetname,
            value: [character],
          },
        },
        exit: { waived: null },
      },
      dappContext: true,
    })
  );

  const characterInMarket = {
    id: character.id,
    character,
    sell: { instance, publicFacet: sellAssetsPublicFacet, price },
  };

  return characterInMarket;
};

export const buyCharacter = async (service: AgoricState, characterInMarket: CharacterInMarketBackend) => {
  const {
    agoric: { walletP },
    contracts: {
      characterBuilder: { publicFacet },
    },
    purses,
  } = service;

  if (!publicFacet || !walletP) return;

  const characterPurse = purses.character[purses.character.length - 1];
  const moneyPurse = purses.money[purses.money.length - 1];

  if (!characterPurse || !moneyPurse) return;

  const { sell, character } = characterInMarket;

  const invitation = await E(sell.publicFacet).makeBuyerInvitation();

  await E(walletP).addOffer(
    harden({
      id: Date.now().toString(),
      invitation,
      proposalTemplate: {
        want: {
          Items: {
            pursePetname: characterPurse.pursePetname,
            value: [character],
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
