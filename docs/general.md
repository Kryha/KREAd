# KREAd
KREAd is an dynamic NFT application showcasing the SAGES universe. It is build on Agoric, a blockchain and smart-contract platform in the Cosmos ecosystem.

Dynamic NFTs provide new ways of showcasing and interacting with digital art by allowing users to change NFTs they own by equipping/unequipping other NFTs to/from it. To understand how this works, we need to first define some KREAd specific terms:

**Character**: one of two NFT types within KREAd, characters are digital assets that represent a person in the SAGES universe. It contains the following properties:

| key             | description                           | type                       | example                                                                                                             |
|-----------------|---------------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------|
| title           | TBD                                   | string                     | 'Bounty Hunter'                                                                                                     |
| origin          | TBD                                   | string                     | 'Arma'                                                                                                              |
| description     | TBD                                   | string                     | 'A Bounty Hunter from Wildlands.'                                                                                   |
| level           | TBD                                   | number                     | 51                                                                                                                  |
| artistMetadata  | Link to the artists Instagram account | string (link to IG page)  | 'https://www.instagram.com/enmanueljrperez/'                                                                        |
| image           | Link to the character image           | string (link to webp file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/images/001.webp' |
| characterTraits | Link to the character traits          | string (link to json file) | 'https://pink-defensive-jay-557.mypinata.cloud/ipfs/Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Citizen/metadata.json'   |


