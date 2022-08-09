# KREAd.app

Character builder dApp for composable NFTs.

KREAd.app is using the full suite of Agoric to implement NFT composability. The NFTs are all still valid ERTP (Electronic Rights Transfer Protocol) tokens, the native implementations of Fungible, non-fungible, and even semi-fungible tokens on Agoric. This allows any smart contract utilising the implementation of ERTP to interact with them. Including the ability to transfer with Offer Safety using Zoe, to make sure users get what they expect, or get their assets returned.

---

## Find out more about the project

- [Kryha Case](https://kryha.io/cases/kread-app/)
- [Agoric](https://agoric.com/)

---

## Getting Started

### Run a local AG-Solo + Wallet + Frontend

### Terminal 0 - Agoric Config

1. Follow Agoric docs on how to setup your [local SDK](https://papers.agoric.com/documentation/getting-started/before-using-agoric.html)
2. `cd <project-root>/agoric`
3. `agoric install`

### Terminal 1 - Agoric Start

1. `agoric start -v --reset`

### Terminal 2 - Agoric Deploy Contracts

1. `agoric deploy contract/kread-deploy-contract.js api/kread-deploy-api.js`
2. `agoric open --repl`

### Terminal 3 - Frontend start

1. Remove `type: module` from `package.json`
2. yarn start
3. Remember to put back the `type: module` before commiting your changes

---

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
