**Semi-fungible token**: works like a non-fungible token, meaning it can hold arbitrary data however, unlike NFTs, multiple SFT with the same data can be minted. KREAd Items are SFTs for example: an item may contain the following data:

```js
SkyGrayBackground = {
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
unlike NFTs, any number of SkyGray items can be minted by the Item issuer, all equal and interchangeable. 

**Character Inventory**: each character has an inventory used to store Items. Inventories have a limited number of slots (10), each meant to hold items of a particular category. At the core of the inventory is an Agoric Seat, which on its own can be used to escrow and reallocate assets between users/contracts. You can think of a Character's inventory as a wallet that lives on-chain and enforces the following logic:

1. Cannot hold 2 or more items of the same category
2. Only the owner of a given Character can modify its inventory (equip/unequip/swap) 
3. Only KREAd Items can be equipped, no other token brands are accepted

**Equip**: equipping an Item involves executing an offer that transfers the Item SFT from the wallet of a Character owner to the KREAd contract, specifically to the inventory seat of that Character (equipping to Characters you do not own is disallowed). Doing so will change the appearance of the character and add to the properties it already had (for as long as the Item is equipped). Note that ownership of the Character SFT is the only requirement for modifying its Inventory, so transferring a Character effectively transfers the rights to its inventory.

Character

Item

**Item Category**: Item SFTs have a property `category` which determines how the item will fit (visually) when equipped onto a character's inventory. For example, items of category "mask" will be rendered on top of the character in the position of the character's mouth, while "background" items will be in the center behind the character. Character's are not required to have any items equipped and can only have a single item of a given category at once. Note that all KREAd items share a brand and issuer, despite the added functionality based on its property `category`. Currently, KREAd Items must be one of the following categories:
`background, patch, hair, headPiece, mask, perk1, perk2, filter1, filter2, garment`

**Marketplace**: The KREAd contract includes logic for buying and selling Character and Item assets in an unmanaged P2P marketplace. The marketplace can be used via `kread.app/shop` and allows users to list their Characters or Items for sale at a price of their choosing. From there, anyone with enough funds can buy it. Any sale via KREAd marketplace is subject to a platform fee of (TODO: PLATFORM_FEE) which goes to an address own by KREAd, as well as a royalty fee of (TODO: ROYALTY_FEE) paid to the artist. 

Keep the following logic in mind when using the KREAd's marketplace:
- Each market entry can only contain 1 item or character SFT. (In order to sell 10 items, 10 market entries must be listed)
- Currently, the only supported payment token is IST
- Selling a character transfers access to its inventory. If you wish to keep the items equipped when selling a character make sure you unequip them beforehand
- Marketplace listings can be cancelled, so you are free change your mind about selling an asset as long as no one has fulfilled the offer. 
  
**Sell**: KREAd's marketplace supports the sale of both Characters and Items. Calling `makeSellCharacterInvitation` or `makeSellItemInvitation` (a contract public method) returns an invitation to sell, which can be used to form an Agoric Offer (TODO: linkt to offer docs). The sell offer proposal must adhere to the following format:
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

Once the market listing is created, it will be visible at kread.app/shop, where any user can buy it (provided they have enough IST to cover the set asking price + fees). The user sets the asking price via the offer's want property, then Agoric's Offer Safety (TODO: offer safety link) guarantees they will either receive the asking price and transfer the asset to the buyer, or maintain the right to cancel the offer (and receive their asset back). 

KREAd does not impose a time limit to market entries, as long as its creator does not cancel it it will be available for a counter party to fulfill the offer.

When a new entry is added using a sell method, the list of market entries on Agoric's storage node is updated, allowing the KREAd frontend to display the new offer in kread.app/shop.

>A 10% royalty fee and a 3% platform fee applies to every sale initiated via KREAd's sell invitations. For example, if a user sets an asking price of 100 IST, the buyer must pay 113 IST in order cover the fees.


**Buy**: 

**Storage node**: part of the Agoric stack is the storage node, it works as a data relayer making chain data available to off-chain systems over HTTP and RPC. KREAd relies on the storage node to expose the state of the KREAd contract, 