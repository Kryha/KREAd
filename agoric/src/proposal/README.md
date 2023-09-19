# KREAd Chain Storage Proposal

# Assets
The contract distinguishes between 3 types of assets: `baseCharacters`, `baseItems` and `publishedItems`.
## baseCharacters
This is an `array` of `arrays` with an index and the `baseCharacter` object attached, the index is used to easily manage and delete already minted bases so we ensure each character is unique.

A `baseCharacter` is the metadata that represents a `character` NFT and is the part of the NFT that is static.

## baseItems
This is an `array` of `objects` containing all `baseItems` that can be assigned to a character on mint.

A `baseItem` is the metadata that represents an `item` NFT and is the part of the NFT that is static.

## publishedItems
This is an `array` of `objects` containing all `items` that will be available for first sale on the marketplace, i.e. this is a collection of items published and sold by the artist.

# powers
## brands and issuers
Produce availability for KREAd represented brands required for the NFT types we mint.
Add the ability to use IST within the contract to allow users to mint, buy and sell using IST

# Non-Agoric fees
The contract collects two types of fees to be distributed to pre-defined addresses, royalties go to the artist and platformFees are taken by Kryha. This happens on character mint and on marketplace sales.
