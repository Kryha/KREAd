
#### Semi-fungible token (SFT)
Behaves like a non-fungible token, meaning it's a digital asset that can hold arbitrary data. However, unlike NFTs multiple SFTs with the same data can be minted. For example, 10 SFTs with data `{ type: "background" }` can exist, while in the case of NFTs only a single NFT can exist with the exact same data. The KREAd contract can mint two SFTs [brands](https://docs.agoric.com/glossary/#brand): [KREAd Characters](#character-sft) and [KREAd Items](#item-sft).

#### Character SFT
[Semi-fungible token](#semi-fungible-token-sft) representing a character in the SAGES universe. Each character can be identified by a unique image and a set of properties related to the SAGES story. Characters can be minted for a fee via KREAd's frontend. When minting, the user must choose a valid name for the character, and will reviece a randomly selected character from a predefined set. On their own, Character assets behave like any other SFT on Agoric, meaning they can be used in offers and be recognized by other contracts. For example they can be sold and bought by anyone using the marketplace section of KREAd's frontend, or they can be sent to a different marketplace contract on the Agoric chain that handles SFTs. KREAd extends the functionality of Characters by providing an Inventory in which to store [KREAd Items](#item-sft). 

See the table and example below for more information about the properties that make up KREAd Character SFTs:

| Character | Description | Type                       | Example                                                                                                             |
|-----------------|---------------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------|
| title           | TBD                                   | string                     | 'Bounty Hunter'                                                                                                     |
| origin          | TBD                                   | string                     | 'Arma'                                                                                                              |
| description     | TBD                                   | string                     | 'A Bounty Hunter from Wildlands.'                                                                                   |
| level           | TBD                                   | number                     | 51                                                                                                                  |
| artistMetadata  | Link to the artists Instagram account | string (link to IG page)  | 'https://www.instagram.com/enmanueljrperez/'                                                                        |
| image           | Link to the character image           | string (link to webp file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/images/001.webp' |
| characterTraits | Link to the character traits          | string (link to json file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/metadata.json'   |

```js
CharacterSFT = {
  "artistMetadata": "https://instagram.com/enmanueljrperez?igshid=MzRlODBiNWFlZA==",
  "characterTraits": "",
  "date": {
    "absValue": "1700056310n",
    "timerBrand": {}
  },
  "description": "A Citizen from the Wildlands.",
  "id": 95,
  "image": "QmR16ndHynQmrRLXMFV5YkJGUYA1BKGij2PKU9JsnJmMTy/08.png",
  "keyId": 1,
  "level": 1,
  "name": "juanito",
  "origin": "Wildlands",
  "title": "Citizen",
  "url": "https://builder.agoric.kryha.dev/static/media/default-character.216ad02c.png"
}
```
> 💡 Properties containing IPFS cids do not include the full url, prefix them with `https://pink-defensive-jay-557.mypinata.cloud/ipfs/` if you wish to access the document

#### Item SFT
Semi-fungible token representing items that can be equipped to and from a Character's [Inventory](#character-inventory). Each Item contains a set of properties which relate to the SAGES universe, including an image showing how it looks. Items can be equipped to and unequipped from a Character's inventory by its owner, doing so results in changes to the Character's appearance and [dynamic] properties, such as the character level. It's important to understand that [equipping](#equip) an Item SFT requires escrowing the token on contract, this ensures equipped items can only be equipped to a single Inventory at once, and preserves a Character's inventory when transferring the Character.

See the table and example below for more information about the properties that make up KREAd Item SFTs:

| Item           | description                                                                                                           | type                       | example                                                                                                             |
|----------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------|
| name           | TODO                                                                                                                  | string                     | 'Bounty Hunter'                                                                                                     |
| origin         | TODO                                                                                                                  | string                     | 'Arma'                                                                                                              |
| description    | TODO                                                                                                                  | string                     | 'A Bounty Hunter from Wildlands.'                                                                                   |
| level          | TODO                                                                                                                  | number                     | 51                                                                                                                  |
| rarity         | number value indicating item rarity (higher is more rare)                                                             | number (TODO: range)       | 18                                                                                                                  |
| category       | determines which inventory slot and the item can be equipped to, inventories can only hold 1 item of a given category | string                     | 'background'                                                                                                        |
| sense          | TODO                                                                                                                  | number                     | 0                                                                                                                   |
| weight         | TODO                                                                                                                  | number                     | 0                                                                                                                   |
| colors         | List of colors present in the item, used for filters                                                                  | string []                  | []                                                                                                                  |
| reserves       | TODO                                                                                                                  | number                     | 0                                                                                                                   |
| functional     | TODO                                                                                                                  | boolean                    | false                                                                                                               |
| artistMetadata | Link to the artists Instagram account                                                                                 | string (linkt to IG page)  | 'https://www.instagram.com/enmanueljrperez/'                                                                        |
| image          | Link to the character image                                                                                           | string (link to webp file) | 'pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/images/001.webp' |


```js
ItemSFT = {
  "artistMetadata": "https://instagram.com/enmanueljrperez?igshid=MzRlODBiNWFlZA==",
  "category": "background",
  "description": "Like an unspoken language, it communicates emotion, directs attention, and influences perception. Whether vibrant, muted, or in between, it's the silent foundation of visual harmony.",
  "image": "https://pink-defensive-jay-557.mypinata.cloud/ipfs/QmfW1CGtyn3t5MUfwk86n936og7Q3ruhKda5nu6ExJAp8N/Sky%20gray.png",
  "name": "Sky gray",
  "origin": "Mount",
  "rarity": 18,
  "thumbnail": "https://pink-defensive-jay-557.mypinata.cloud/ipfs/QmfW1CGtyn3t5MUfwk86n936og7Q3ruhKda5nu6ExJAp8N/Sky%20gray.png",
}
```
> 💡 Properties containing IPFS cids do not include the full url, prefix them with `https://pink-defensive-jay-557.mypinata.cloud/ipfs/` if you wish to access the document


#### Character Inventory
Each [Character](#character-sft) has an inventory used to store [Items](#item-sft). Inventories have a limited number of slots (10), each meant to hold items of a particular [category](#item-category). At the core of the inventory is an [Agoric Seat](https://docs.agoric.com/glossary/#seat), which on its own can be used to escrow and reallocate assets between users/contracts. You can think of a Character's inventory as a wallet that lives on-chain and enforces the following logic:

1. Cannot hold 2 or more items of the same category
2. Only the owner of a given Character can modify its inventory (equip/unequip/swap) 
3. Only KREAd Items can be equipped, no other token brands are accepted

#### Item Category
Item SFTs have a property `category` which determines how the item will fit (visually) when equipped onto a character's inventory. For example, items of category `mask` will be rendered on top of the character in the position of the character's mouth, while `background` items will be in the center behind the character. Character's are not required to have any items equipped and can only have a single item of a given category at once. Note that all KREAd items share a brand and issuer, despite the added functionality based on its property `category`. Currently, KREAd Items must be one of the following categories:
`background, patch, hair, headPiece, mask, perk1, perk2, filter1, filter2, garment`

#### Equip
Equipping an Item involves executing an offer that transfers the Item SFT from the wallet of a Character owner to the KREAd contract, specifically to the inventory seat of that Character (equipping to Characters you do not own is disallowed). Doing so will change the appearance of the character and add to the properties it already had (for as long as the Item is equipped). Note that ownership of the Character SFT is the only requirement for modifying its Inventory, so transferring a Character effectively transfers the rights to its inventory. 

An equip offer looks like this:

```js
const equipProposal = {
    // the following assets are sent from your wallet to Zoe
    give: {
        // the character SFT you wish to equip to, it's temporarily sent to Zoe as proof of ownership and will be returned
        CharacterKey2: {
            brand: characterBrand,
            value: makeCopyBag([[characterToEquipTo, 1n]]),
        },
        // the item SFT you wish to equip
        Item: {
            brand: itemBrand,
            value: makeCopyBag([[itemToEquip, 1n]]),
        },
    },
    // the following assets must be received or the give will be returned
    want: {
        // the character must be returned
        CharacterKey1: { brand: characterBrand, value: makeCopyBag([[characterToEquipTo, 1n]]) },
    }
};

```

#### Unequip
The unequip action allows the owner of a [Character](#character-sft) to transfer an item from the Character's Inventory to their own wallet. Only one Item can be unequipped at a time and the only requirement is ownership of the Character. A user may want to unequip an item for the following reasons:
1. To change the properties of a Character (look and stats)
2. To manually equip a different item of the same category (consider using [swap](#swap) in this situation)
3. To sell the item in the marketplace
   
An unequip proposal looks like this:
```js
const unequipProposal = {
    // the following assets are sent from your wallet to Zoe
    give: {
        // the character SFT you wish to equip to, it's temporarily sent to Zoe as proof of ownership and will be returned
        CharacterKey1: { brand: charBrand, value: makeCopyBag([[characterToEquipTo, 1n]]) },
    }
    // the following assets must be received or the give will be returned
    want: {
        // the character must be returned
        CharacterKey2: {
            brand: charBrand,
            value: makeCopyBag([[characterToEquipTo, 1n]]),
        },
        // the item SFT you wish to unequip
        Item: {
            brand: itemBrand,
            value: makeCopyBag([[wantedItem, 1n]]),
        },
    },
};
```

#### Swap
The swap action allows the owner of a [Character](#character-sft) to swap an [Inventory](#inventory) item for one from their wallet. Since only one Item per [category](#item-category) can be equipped at a time, replacing an equipped item would require two separate transaction (first unequip, then equip new item). The swap action combines it into a single transaction and allows users to replace an equipped item for anotherone of the same category. 
   
A swap proposal looks like this:
```js
const swapProposal = {
    // the following assets are sent from your wallet to Zoe
    give: {
        // the character SFT you wish to perform a swap on, it's temporarily sent to Zoe as proof of ownership and will be returned
        CharacterKey1: { brand: charBrand, value: makeCopyBag([[characterToEquipTo, 1n]]) },
         // the item SFT you wish to equip (must be the same category as proposal.want.Item)
        Item: {
            brand: itemBrand,
            value: makeCopyBag([[wantedItem, 1n]]),
        },
    },
    // the following assets must be received or the give will be returned
    want: {
        // the character must be returned
        CharacterKey2: {
            brand: charBrand,
            value: makeCopyBag([[characterToEquipTo, 1n]]),
        },
        // the item SFT you wish to unequip
        Item: {
            brand: itemBrand,
            value: makeCopyBag([[wantedItem, 1n]]),
        },
    },
};
```


#### Marketplace 
The KREAd contract includes logic for buying and selling Character and Item assets in an unmanaged P2P marketplace. The marketplace can be used via `kread.app/shop` and allows users to list their Characters or Items for sale at a price of their choosing. From there, anyone with enough funds can buy it. Any sale via KREAd marketplace is subject to a platform fee of (3% of sale price) which goes to an address own by KREAd, as well as a royalty fee of (10% of sale price) paid to the artist. 

Keep the following logic in mind when using the KREAd's marketplace:
- Each market entry can only contain 1 item or character SFT. (In order to sell 10 items, 10 market entries must be listed)
- Currently, the only supported payment token is IST
- Selling a character transfers access to its inventory. If you wish to keep the items equipped when selling a character make sure you unequip them beforehand
- Marketplace listings can be cancelled, so you are free change your mind about selling an asset as long as no one has fulfilled the offer. 
  
#### Sell
KREAd's marketplace supports the sale of both Characters and Items. Calling `makeSellCharacterInvitation` or `makeSellItemInvitation` (a contract public method) returns an invitation to sell, which can be used to form an [Agoric Offer](https://docs.agoric.com/guides/zoe/proposal.html). The sell offer proposal must adhere to the following format:
```js
// for makeSellItemInvitation
const proposal {
    want : {
        Price: { brand: IST_BRAND, value: ASKING_PRICE_IN_IST },
    },
    give: {
        Item: { brand: KREAD_ITEM_BRAND, value: ITEM_TO_SELL },
    }
}

// for makeSellCharacterInvitation
const proposal {
    want : {
        Price: { brand: IST_BRAND, value: ASKING_PRICE_IN_IST },
    },
    give: {
        Item: { brand: KREAD_CHARACTER_BRAND, value: CHARACTER_TO_SELL },
    }
}
```
>Assets specified on an Offer's give will be escrowed by Zoe (Agoric's smart contract platform) once they sign the offer transaction, meaning they will no longer be in the user's wallet the unless they cancel the offer before completion.

Once the market listing is created, it will be visible at kread.app/shop, where any user can buy it (provided they have enough IST to cover the set asking price + fees). The user sets the asking price via the offer's want property, then Agoric's [Offer Safety](https://docs.agoric.com/glossary/#offer-safety) guarantees they will either receive the asking price and transfer the asset to the buyer, or maintain the right to cancel the offer (and receive their asset back). 

KREAd does not impose a time limit to market entries. As long as its creator does not cancel it, it will be available for a counter party to fulfill the offer.

When a new entry is added using a sell method, the list of market entries on Agoric's storage node is updated, allowing the KREAd frontend to display the new offer in kread.app/shop.

>A 10% royalty fee and a 3% platform fee applies to every sale initiated via KREAd's sell invitations. For example, if a user sets an asking price of 100 IST, the buyer must pay 113 IST in order cover the fees.


#### Buy
KREAd's marketplace can be used to buy Item and Character SFTs sold by the community or KREAd itself in the case of Items. It can be accessed via [kread.app/shop](https://kread.app/shop/items) and allows users to browse from a list of market entries and filter by color, rarity, category, price, and other properties of KREAd SFTs. All payments are in IST and both artist (10%) and platform (2%) fees are included. 

A buy offer looks like this:
```js
const buyCharacter = {
    give: {
        // price must be equal or greater than the listing for the wanted character
        Price: { brand: istBrand, value: price },
    },
    want: {
        Character: { brand: characterBrand, value: makeCopyBag(harden([[characterToBuy, 1n]])) },
    }
}
```


#### Storage node
Part of the Agoric stack is the storage node, it works as a data relayer making chain data available to off-chain systems over HTTP and RPC. KREAd relies on the storage node to expose the state of the KREAd contract, 
