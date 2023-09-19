# KREAd contract

# index.js
Contains initialization of `kreadKit` with correct data such as:
* Paths used for storage nodes of data to be availabe through RPC
* Creation of asset mint capabilities (`characters` and `items`)
* creation of `storageNode` access
* Creation of ratios based on provided `terms`

And eventually exposes the `creatorFacet` and `publicFacet`

# kreadKit.js
The brunt of all KREAd functionality lives here, this utilises the capabilities granted by `index.js` to provide the end-user the ability interact with the contract and the storage-proposal to create and initialize it correctly.

The kit consists of initialization and 6 facets: `character`, `item`, `market`, `helper`, `public` and the `creator`

## init
setup all durable storage for the data required by the contract, this consists of the following:
* `characters`: all characters that have been minted by end-users
* `baseCharacters`: all currently available (not been minted) `baseCharacters`
* `items`: all items that have been minted by the artist through publishing an item collection AND the items assigned (and minted) on character mint
* `baseItems`: `baseItems` the items that can be assigned (and minted) on character mint
* `characterMarket`: all characters that have currently been put up for sale by end-users
* `itemMarket`: all items that are currenctly for sale, either first-sales by the artist or secondary sales by end-users

It also holds metric data more ephemeral, reset on contract upgrade and to be revived through the proposal.


## helper
The helper facet exposes functions that are shared between all facets listed here.

## character
This contains all functions related to characters and the management of them, it contains the following helper functions:
* `calculateLevel`
* `validateInventoryState`: ensures that the inventory state is no breaking any rules (does not contain multiple items with the same category, this automatically limits the size of the inventory to 10 as these categories are the only ones allowed)
* `isNameUnique`
* `getRandomBaseIndex`: gets a random number based on the indexes left in the `baseCharacter` storage
* `makeInventoryRecorderKit`

and the following functions that are exposed to the end-user through the public facet:
* `mint`: mints a new character NFT with the name provided by the end-users through offer-args, it also requires a `30000000 uist` give in `Price` in the proposal as a mint fee. This character mint will do the following things on contract:
  * pick a random base index to retrieve from the `baseCharacter` storage to assign to this NFT (it is removed after)
  * create an empty seat to represent the inventory
  * mint 2 character NFT keys, to be used as access to this characters specific inventory. 1 is sent to the user 1 is sent to the inventory seat
  * create a storage node path (`inventoryRecorderKit`) based on the name of the NFT (the name is sanitized using a regex + string length of max `20`)
  * mint the starting items to the character using the `item` facet `mint` function
  * distribute the payed mint fee to the royalty and platform addresses and payout the NFT
  * update durable storage with: `character` entry, update collection (`market`) metrics
  * write the inventory update to the inventory Path
  * write the character update to the character vstorage  
* `equip`: takes a `characterKey` + an `item` in give and a `characterKey` in want. equip will do the following things on contract:
  * ensure character exists and the correct keys are being swapped
  * adds the item to the current allocation, tests whether this allocation is a valid state, if not errors out otherwise it continues
  * does a reallocation of funds to the correct seats
  * updates the inventory recorder with the updated inventory
* `unequip`: takes a `characterKey` in give and an `item` + a `characterKey` in want. unequip will do the following things on contract:
  * ensure character exists and the correct keys are being swapped
  * does a reallocation of funds to the correct seats
  * updates the inventory recorder with the updated inventory
* `swap`: takes a `characterKey` + `item` in give and an `item` + a `characterKey` in want
  * ensure character exists and the correct keys are being swapped
  * changes the current allocation based on the items being swapped around, tests whether this allocation is a valid state, if not errors out otherwise it continues
  * does a reallocation of funds to the correct seats
  * updates the inventory recorder with the updated inventory
* `unequipAll`: takes a `characterKey` in give and all `items` + a `characterKey` in want. unequipAll will do the following things on contract:
  * ensure character exists and the correct keys are being swapped
  * does a reallocation of all items to the user seat + further reallocation to the correct seats
  * updates the inventory recorder with the updated inventory

## item
This contains all functions related to items and the management of them, it contains the following creatorFacet functions:
* `initializeBaseItems`
* `mintBatch`: mints a batch of items defined as an array of `item objects` + `supply` to the seat that made called invitation. Mintbatch will do the following on contract:
  * create amounts for provided items
  * creates SFTs for each item, supply being provided by array of objects
  * all minted items are added as entries in the durable storage `items`
  * all item updates are written to the `items` vstorage path
  * market metrics are updated based on what was minted

and the following functions that are used by other assets through the public facet:
* `mintDefaultBatch`: mints the 3 `baseItems` that are given to each character. This mintDefaultBatch will do the following things on contract:
  * pick a random common item from the common bases
  * pick a second random common item from the common bases, but filter on category (we do not want to mint multiple of the same categories to a character as that invalidates the inventory)
  * pick a third item, this time from the legendary bases and filter out both categories picked already.
  * mint these items to the inventory seat
  * all minted items are added as entries in the durable storage `items`
  * all item updates are written to the `items` vstorage path
  * market metrics are updated based on what was minted

## market
This contains all functions related to marketplace and the management of them.

It contains the following helper functions:
* `handleExitCharacter` and `handleExitItem`: these are long living promises that listen to the exit status of marketplace listings, this allows the end-users to call exit offer from anywhere (wallet-ui etc..). This removes the entry from durable storage and updates the market storage node with the updated list of things for sale.
* `updateMetrics`: uses util functions in `market-metrics.js` to calculate and update metrics

It contains the following creatorFacet functions:
* `publishItemCollection`: mints a batch of items defined as an array of `item objects` + `supply` and the `salePrice` to the seat that called invitation. Mintbatch will do the following on contract:
  * mints the items
  * defines the fees (royalty and platform)
  * creates marketplace entries and lists them as `isFirstSale = true`
  * all minted items are added as entries in the durable storage `market-items`
  * all marketplace updates are written to the `market-items` vstorage path updating the currently for sale items
  * market metrics are updated based on what was put on sale

and the following functions that are exposed to the end-user through the public facet:
* `sellItem`: puts an item on the marketplace based on the `item` and price in give. This sellItem will do the following things on contract:
  * ensure brand is the defined paymentbrand we set
  * calculate the fees required when buying the item
  * create a marketplace entry and add it to the market durable storage
  * update the market recorder with the updated list of items for sale
  * update the metrics based on the item put for sale
  * start an exit subscriber for the item
* `sellCharacter`: puts a character on the marketplace based on the `character` and price in give. This sellCharacter does the same as `sellItem` to the contract, only changin what storage node and durable storage to update.
* `buyItem`: attempts to buy an item listed on the marketplace based on the entryId in the offer args + price in give and `item` in want. This buyItem will do the following things on contract:
  * ensure the sell record exists
  * define whether it is first or secondary sale and use the correct function
  * `buyFirstSale` and `buySecondarySale` differences: Seat does not exit on first sale, fees are different on first sale
  * ensure the give price is higher than the price listed + the fees
  * ensure the want item is the correct item
  * reallocate funds
  * remove marketplace ntry from market durable storage
  * update the market recorder with the updated list of items for sale
  * update the metrics based on the item just bought
* `buyCharacter`: attempts to buy a character on the marketplace based on the `character` in want and the price in give. This buyCharacter does the same as `sellItem` to the contract however, it only consists of secondary sale objects and it changes what storage node and durable storage to update.

## public
This contains wrappers for all functions that are needed for end-users to create their invitations from the UI.

It contains the following helper functions for tests:
  * `getCharacters`: 
  * `getCharacterInventory`: 
  * `getCharactersForSale`: 
  * `getItemsForSale`: 
  * `getMarketMetrics`: 
  * `getCharacterLevel`: 

It contains the following wrapped functions for end-users:
  * `makeMintCharacterInvitation`: 
  * `makeMintItemInvitation`: 
  * `makeEquipInvitation`: 
  * `makeUnequipInvitation`: 
  * `makeUnequipAllInvitation`: 
  * `makeItemSwapInvitation`: 
  * `makeSellCharacterInvitation`: 
  * `makeBuyCharacterInvitation`: 
  * `makeSellItemInvitation`: 
  * `makeBuyItemInvitation`: 


## creator
This contains wrappers for all functions that are needed to setup the contract correctly and ensure it can be upgraded/restarted correctly.

It contains the following helper functions for tests:
  * `makeMintItemInvitation`:


It contains the following wrapped functions for contract start and governance:
  * `initializeMetrics`: initializes the metrics with a base value
  * `reviveMarketExitSubscribers`: loops over all marketplace entries in durable storage and calls the function to start the exit subscriber
  * `initializeBaseAssets`: provides the `baseCharacters` and `baseAssets`. This will do the following things on contract:
    * add the list of base characters to durable storage with a numbered key
    * add the base items to the corresponding rarity list and adds this to durable storage
  * `makePublishItemCollectionInvitation`: publishes a new item collection
