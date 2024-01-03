# Kread

KREAd is a decentralized application deployed on Agoric, an open-source development company launching an interoperable Proof-of-Stake chain and economy. The dApp is imagined, built, and designed by Kryha. The SAGES art and comic is created by Enmanuel Heredia.

## Getting Started

The KREAd application consists of a set of smart contracts deployed on Agoric and a frontend application to interact with them. The frontend can be accessed at [kread.app](http://kread.app/) and includes a network selector on the bottom left of the landing page to connect to different networks:

1. Mainnet: hosts the official KREAd application, you can use it to mint, customize, and view your character as well as sell and buy using the KREAd marketplace. IST is used for payments and transaction fees can be paid in BLD or IST.
2. Emerynet: this network is meant for testing purposes and can be used to try out the application without spending real funds. The functionality is identical to Mainnet although the content may vary. You can use the [emerynet faucet](https://emerynet.faucet.agoric.net/) to get fake IST which can be used to interact with the KREAd contract.
3. Local: the KREAd frontend can also be connected to an Agoric chain running locally, this gives you full control by allowing changes to KREAd's source code. You can find instructions on how run KREAd locally [here](./agoric/README.md)

## Build and Test

TODO: Describe and show how to build your code and run the tests.

## Contribute

TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

## To Run a local AG-Solo + Wallet + frontend

### Terminal 1 - agoric

1. `agoric start -v --reset`

### Terminal 2 - agoric

1. `agoric deploy contract/kread-deploy-contract.js api/kread-deploy-api.js`
2. `agoric open --repl`

### Terminal 3 - frontend

1. Remove `type: module` from `package.json`
2. yarn start
3. Remember to put back the `type: module` before commiting your changes

## Run multiuser

To run the application for more than one user follow these steps:

0. Install GO!
   1. `brew install go`
1. Run Make in your local agoric-sdk directory
   1. `cd <local-sdk-path>/packages/cosmic-swingset`
   2. `make`
2. Run the chain:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make chain-reset` and wait until it starts validating blocks
3. Run ag-solo for the first user:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make solo0-reset` and wait until it prints "Deployed wallet!"
4. Run ag-solo for the second user:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make solo1-reset` and wait until it prints "Deployed wallet!"
5. Configure wallet and localStorage for the first user:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make wallet0` and open the url in a new browser tab
6. Configure wallet and localStorage for the second user:
   1. Open a new browser or a new session
   2. `make wallet1` and open the url in the new session or browser
7. Deploy contract and api:
   1. Open `frontend/package.json` and add `"type": "module"` to the configuration
   2. From `agoric/` directory run `make deploy`
   3. After everything is deployed, remove the line you added to `frontend/package.json`
8. On the session with the wallet listening to port 8001:
   1. Navigate to `local.agoric.com`
   2. In the text field type `https://localhost:8001/#accessToken=<access_token_value>` where `access_token_value` is the value you get when executing `make wallet1`
   3. Click `save`, then click `open`
   4. Navigate to `local.agoric.com`
   5. In the text field type `https://localhost:8001/`
   6. Click `save`, then click `open`
9. Run frontend:
   1. Open a new terminal window
   2. `cd frontend/`
   3. `yarn start`
   4. Navigate to `localhost:3000` on each session and approve the app in both wallets
10. Enjoy!

