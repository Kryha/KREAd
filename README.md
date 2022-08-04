# Kread

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

## Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. Installation process
2. Software dependencies
3. Latest releases
4. API references

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

1. `agoric deploy contract/nft-maker-contract-deploy.js api/nft-maker-deploy-api.js`
2. `agoric open --repl`

### Terminal 3 - frontend

1. Remove `type: module` from `package.json`
2. yarn start
3. Remember to put back the `type: module` before commiting your changes

## Run multiuser

To run the application for more than one user follow these steps: 00. Install GO! 1. `brew install go` 0. Run Make in your local agoric-sdk directory 1. `cd <local-sdk-path>/packages/cosmic-swingset` 2. `make`

1. Run the chain:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make chain-reset` and wait until it starts validating blocks
2. Run ag-solo for the first user:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make solo0-reset` and wait until it prints "Deployed wallet!"
3. Run ag-solo for the second user:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make solo1-reset` and wait until it prints "Deployed wallet!"
4. Configure wallet and localStorage for the first user:
   1. Open a new terminal window
   2. `cd agoric/`
   3. `make wallet0` and open the url in a new browser tab
5. Configure wallet and localStorage for the second user:
   1. Open a new browser or a new session
   2. `make wallet1` and open the url in the new session or browser
6. Deploy contract and api:
   1. Open `frontend/package.json` and add `"type": "module"` to the configuration
   2. From `agoric/` directory run `make deploy`
   3. After everything is deployed, remove the line you added to `frontend/package.json`
7. Run frontend:
   1. Open a new terminal window
   2. `cd frontend/`
   3. `yarn start`
   4. Navigate to `localhost:3000` on each session and approve the app in both wallets
8. Enjoy!
