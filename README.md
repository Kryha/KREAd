# Kread

KREAd is a decentralized application deployed on Agoric, an open-source development company launching an interoperable Proof-of-Stake chain and economy. The dApp is imagined, built, and designed by Kryha. The SAGES art and comic is created by Enmanuel Heredia.

## Getting Started

The KREAd application consists of a set of smart contracts deployed on Agoric and a frontend application to interact with them. The frontend can be accessed at [kread.app](http://kread.app/) and includes a network selector on the bottom left of the landing page to connect to different networks:

1. Mainnet: hosts the official KREAd application, you can use it to mint, customize, and view your character as well as sell and buy using the KREAd marketplace. IST is used for payments and transaction fees can be paid in BLD or IST.
2. Emerynet: this network is meant for testing purposes and can be used to try out the application without spending real funds. The functionality is identical to Mainnet although the content may vary. You can use the [emerynet faucet](https://emerynet.faucet.agoric.net/) to get fake IST which can be used to interact with the KREAd contract.
3. Local: the KREAd frontend can also be connected to an Agoric chain running locally, this gives you full control by allowing changes to KREAd's source code. You can find instructions on how run KREAd locally [here](./agoric/README.md)

## Build and Test Locally

Ensure you are in the agoric folder (`KREAd/agoric/`) otherwise `cd agoric`

1. Start the chain
   1. `make local-testnet`
2. make the committee
   1. `make kread-committee`
3. provision the fee collector wallet
   1. `make provision-fee-collector`
4. start the KREAd contract
   1. `make clean start-kread`
5. start frontend locally
   1. `cd ../frontend`
   2. `yarn & yarn dev`
   3. open http://localhost:5173/
   
To confirm the contract was deployed successfully:

- in chain log you should see "CONTRACT INIT SUCCESS"
- after that `agd query vstorage children published` should include "kread"

If you encounter `Request would exceed mint limit` try `make fund-account`
If you are running a local testnet make sure you select "Local" on the frontend's network selector (shown on the bottom right of the landing & connect-wallet pages)

## Contribute

Refer to [Contributing](./CONTRIBUTING.md) for guidelines

