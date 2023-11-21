# KREAd
KREAd is an dynamic nft application showcasing the SAGES universe. It is build on Agoric, a blockchain and smart-contract platform in the Cosmos ecosystem.

Dynamic nfts provide new ways of showcasing and interacting with digital art by allowing users to customize a given nft by equipping or unequipping "item" nfts to its inventory. To understand how this works, let's define the two assets that KREAd introduces:


| KREAd SFT 	| description                                                                                      	| represents                               	| how to obtain                                             	|
|-----------	|--------------------------------------------------------------------------------------------------	|------------------------------------------	|-----------------------------------------------------------	|
| Character 	| a collectable digital asset with an inventory where Items can be equipped to and unequipped from 	| a character in the SAGES universe        	| mint from KREAd's home page or buy on KREAd's marketplace 	|
| Item      	| a collectable digital asset that can be equipped to a Character's inventory                      	| a wearable asset from the SAGES universe 	| buy on KREAd's marketplace                                	|

**Character sft**: semi-fungible token representing a character in the SAGES universe. Each character can be identified by a unique image and a set of properties related to the SAGES story. Characters can be minted for a fee via KREAd's frontend. When minting, the user must choose a valid name for the character, and will reviece a randomly selected character from a predefined set. On their own, Character assets behave like any other sft on Agoric, meaning they can be used in offers and be recognized by other contracts. For example they can be sold and bought by anyone using the marketplace section of KREAd's frontend, or they could be sent to another marketplace contract that enables the sale of sfts. KREAd extends the functionality of Characters by introducing the concept of an Inventory, like the name implies a Character's inventory can be used to store other assets within it, this brings us to the second kind of asset that KREAd manages: 

**Item sft**: semi-fungible token representing items that can be equipped to and from a Character's Inventory. Each Item contains a set of properties which relate to the SAGES universe, including an image showing how it looks. Items can be equipped to and unequpped from a Character's inventory by its owner, doing so results in changes to the Character's appearance and [dynamic] properties, such as the character level. It's important to know that equipping an Item sft requires escrowing the token on contract, this ensures equipped items can only be equipped to a single Inventory at once, and preserves a Character's inventory when transferring the Character.


For a full list of the properties contained in KREAd Character and Item sfts refer to the table below:

| Character | Description | Type                       | Example                                                                                                             |
|-----------------|---------------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------|
| title           | TBD                                   | string                     | 'Bounty Hunter'                                                                                                     |
| origin          | TBD                                   | string                     | 'Arma'                                                                                                              |
| description     | TBD                                   | string                     | 'A Bounty Hunter from Wildlands.'                                                                                   |
| level           | TBD                                   | number                     | 51                                                                                                                  |
| artistMetadata  | Link to the artists Instagram account | string (link to IG page)  | 'https://www.instagram.com/enmanueljrperez/'                                                                        |
| image           | Link to the character image           | string (link to webp file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/images/001.webp' |
| characterTraits | Link to the character traits          | string (link to json file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/metadata.json'   |


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

Character and Item objects taken from KREAd's frontend:
```js
Character = {
  "artistMetadata": "https://instagram.com/enmanueljrperez?igshid=MzRlODBiNWFlZA==",
  "category": "background",
  "colors": [],
  "description": "Like an unspoken language, it communicates emotion, directs attention, and influences perception. Whether vibrant, muted, or in between, it's the silent foundation of visual harmony.",
  "durability": 0,
  "filtering": 0,
  "functional": false,
  "image": "https://pink-defensive-jay-557.mypinata.cloud/ipfs/QmfW1CGtyn3t5MUfwk86n936og7Q3ruhKda5nu6ExJAp8N/Sky%20gray.png",
  "level": 0,
  "name": "Sky gray",
  "origin": "Mount",
  "rarity": 18,
  "reserves": 0,
  "sense": 0,
  "thumbnail": "https://pink-defensive-jay-557.mypinata.cloud/ipfs/QmfW1CGtyn3t5MUfwk86n936og7Q3ruhKda5nu6ExJAp8N/Sky%20gray.png",
  "weight": 0,
  "equippedTo": "",
  "forSale": false
}

Item = {
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