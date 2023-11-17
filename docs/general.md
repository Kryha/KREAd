# KREAd
KREAd is an dynamic nft application showcasing the SAGES universe. It is build on Agoric, a blockchain and smart-contract platform in the Cosmos ecosystem.

Dynamic nfts provide new ways of showcasing and interacting with digital art by allowing users to customize a given nft by equipping or unequipping "item" nfts to its inventory. To understand how this works, let's define the two assets that KREAd introduces:

**Character sft**: semi-fungible token representing a character in the SAGES universe. Each character can be identified by a unique image and a set of properties related to the SAGES story. Characters can be minted for a fee via KREAd's frontend. When minting, the user must choose a valid name for the character, and will reviece a randomly selected character from a predefined set. On their own, Character assets behave like any other sft on Agoric, meaning they can be used in offers and be recognized by other contracts. For example they can be sold and bought by anyone using the marketplace section of KREAd's frontend, or they could be sent to another marketplace contract that enables the sale of sfts. KREAd extends the functionality of Characters by introducing the concept of an Inventory, like the name implies a Character's inventory can be used to store other assets within it, this brings us to the second kind of asset that KREAd manages: 

**Item sft**: semi-fungible token representing items that can be equipped to and from a Character's Inventory. Each Item contains a set of properties which relate to the SAGES universe, including an image showing how it looks. Items can be equipped to and unequpped from a Character's inventory, doing so results in changes to the Character's appearance and properties. 


It contains the following properties:

| key             | description                           | type                       | example                                                                                                             |
|-----------------|---------------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------|
| title           | TBD                                   | string                     | 'Bounty Hunter'                                                                                                     |
| origin          | TBD                                   | string                     | 'Arma'                                                                                                              |
| description     | TBD                                   | string                     | 'A Bounty Hunter from Wildlands.'                                                                                   |
| level           | TBD                                   | number                     | 51                                                                                                                  |
| artistMetadata  | Link to the artists Instagram account | string (link to IG page)  | 'https://www.instagram.com/enmanueljrperez/'                                                                        |
| image           | Link to the character image           | string (link to webp file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/images/001.webp' |
| characterTraits | Link to the character traits          | string (link to json file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/metadata.json'   |


