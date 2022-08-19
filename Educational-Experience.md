⚠️ WORK IN PROGRESS ⚠️

# 1. Agoric Intro

Chapter 1 covers the history, stack, and basic concepts of Agoric

> Brief Motivation & History
> 

Agoric is a smart contract platform aiming to bring developers to the DeFi frontier. It offers a public blockchain in the Cosmos ecosystem, a secure subset of JavaScript for writing smart contracts, and a set of protocols to add DeFi-oriented features such as Offer Safety. Agoric is designed with composability in mind, making it easy to use or write reusable smart contracts. Furthermore, thanks to Dynamic IBC (${link.agoric.dynamicIBC}), digital assets and services can operate across different blockchains.

Its origins can be traced back to a 1988 paper by Mark S. Miller and K. Eric Drexler (${link.agoric.marketsAndComputationPaper1988}), which "examines markets as a model for computation and proposes a framework [Agoric systems] for applying the power of market mechanisms to the software domain", all within the context of decentralized models.

For a deeper look into the Agoric platform check out the Agoric Token and Crypto Economy White Paper (${link.agoric.agoricPaper}).

> Stack Overview
> 

There are three systems at play within the Agoric stack: Smart Contract Framework, Agoric VM, and Agoric Public Blockchain.

*Smart Contract Framework*

The Smart Contract Framework consists of two protocols: ERTP, and Zoe. ERTP (Electronic Rights Transfer Protocol) provides a standard way to represent digital assets while mitigating security hazards. Zoe is a framework for writing JavaScript smart contracts, it leverages ERTP to enable developers to focus on the business logic. Together, they provide offer safety and payout-liveness guarantees, increasing trust in the platform by protecting users against malicious or buggy code.

*Agoric VM*

Under the hood, Agoric VMs consist of a secure, distributed JavaScript runtime that enforces Object-capability (OCap) security architecture, in which access to a programming object itself is the authority to use the object. JavaScript's popularity was in part driven by its composability, allowing code components to be published and imported with ease across projects (think NPM). Agoric's Hardened Javascript (SES) helps secure such components and the risks that come with composability.

*Agoric Public Chain*

The Agoric VM is consensus agnostic and designed to run on the best available engine. The initial launch is will be on the Cosmos Ecosystem, built on the Tendermint consensus engine. Tendermint is a proven Byzantine Fault Tolerant (BFT) consensus engine providing fast throughput and finality. Additionally, Dynamic IBC can handle communication across chains, enabling a wide range of use cases.

In short, Agoric provides a secure and familiar system for creating and exchanging digital assets in a decentralized manner.

*Agoric Dapp*

A typical Agoric decentralized app is made up of the following stack layers:

- Smart Contract(s): contains the business logic of the application, written in SES (Secure Ecma Script, also referred to as Hardened JS).
- Wallet: actors in Agoric are represented by a wallet. Holds and manages digital assets and interactions with smart contracts via Zoe Invitations. Sits between the client and blockchain, providing an extra layer of security by allowing the user to review actions initiated by external applications.
- Client: framework-agnostic web application, only requirement here is that it can run JS. Tasked with retrieving and displaying contract data, as well as forming requests to interact with the contract layer, much like the client-backend relation in web2.
- Local Bridge: web-socket connection managing communication between the wallet and client. Allows the client to read information from wallets, and send requests to interact with smart contracts.

> ERTP, Zoe, and Offer Safety
> 

Let's dive deeper into Agoric's smart contract layer: Zoe. Tasked with the creation and handling of smart contracts, Zoe plays a big role in enforcing some of the fundamental concepts that make Agoric unique. Along with ERTP, Zoe allows users to define what they expect to give and/or receive per transaction and ensures those conditions are met, reverting to the original state otherwise.
This is known as Offer Safety, and becoming familiar with the concept and how to correctly implement it will allow you to get the most out of Agoric contracts/apps.

Imagine a smart contract that trades NFTs in exchange for IST (Agoric's stable token). A user wanting to purchase an NFT using this contract can form an offer specifying the NFT they expect to receive, and the amount of IST they are willing to give. Zoe will then escrow the asset(s) you're willing to give, and guarantees the offer will resolve in one of two ways:

- All parties get their specified "want": everything went as expected and the payouts are executed accordingly.
- All parties get their specified "give": something went wrong or the offer was canceled before completion and the escrowed assets return to the owners

Furthermore, exit conditions can be set to customize the conditions under which offers can be exited. Offer Safety allows users to send assets without the need to understand or trust
the contract code that handles it, knowing Zoe will guarantee the proposed offer will be fulfilled or reverted. As for developers, it mitigates risk by limiting the impact of bugs in the code.

Note that while Offer Safety is always enforced, it is limited to Offers (contract calls involving assets), which isn't the only way to interact with smart contracts. Furthermore, users can simply disregard the want and/or give properties of an offer, effectively bypassing Offer Safety checks. Design patterns aimed at making the most of this feature will be discussed in detail in later sections of this guide.

Digital assets are fundamental to the decentralized financial market that Agoric envisions, and the Electronic Rights Transfer Protocol (ERTP) defines how they operate in Agoric.  The specifics regarding the kind of assets allowed and how to work with them will be covered in detail in chapter 3.

> SES
> 

Secure Ecma Script is a subset of Javascript designed to make JS secure and it's required for writing Agoric smart contracts and clients that wish to interact with them. Its main features include:

- Compartments: Compartments are separate execution contexts: each one has its own global object and global lexical scope.
- Frozen realm: Compartments share their intrinsics to avoid identity discontinuity. By freezing the intrinsics, SES protects programs from each other. By sharing the intrinsics, programs from separate compartments can recognize each other's arrays, data objects, and so on.
- Strict mode SES enforces JavaScript strict mode that enhances security, for example by changing some silent failures into thrown errors.
- POLA (Principle of Least Authority) By default, Compartments receive no ambient authority. They are created without host-provided APIs, (for example no fetch). Compartments can be selectively endowed with powerful arguments, globals, or modules.

SES safely executes third-party JavaScript 'strict' mode programs in compartments that have no excess authority in their global scope. SES runs atop an ES6-compliant platform, enabling safe interaction of mutually-suspicious code, using object-capability -style programming.

# 2. Chain, Ag-solo, Wallet, and Client

Chapter 2 covers the installation and setup of the SDK

> Understanding the stack
> 

While an in-depth explanation of each stack of the SDK is out-of-scope for this guide, understanding what each component does and how they interact can go a long way when designing, developing, and debugging Agoric applications.

At the lowest level is the Agoric simulated chain, which simulates the blockchain on which smart contracts are executed and serves as a network that can interact with Ag-solo processes. Ag-solo processes are off-chain Agoric VMs. They have their own UI and way of communicating with chains (including multiple chains and network connections). An Ag-solo process can host a wallet, which is a user's *trusted agent.* A wallet enables or disables inbound connections from Dapps and approves or declines proposals from those Dapps.

Lastly, the client web app is able to communicate with the wallet and smart contracts via a web-socket connection known as Local Bridge, providing a way to visualize and interact with blockchain data, as well as local wallets.

> Getting the SDK
> 

First things first. Install the Agoric SDK by cloning the Agoric repo,  running yarn install & build, then linking its path appropriately

```bash
node --version # 14.15.0 or higher
npm install --global yarn
git clone https://github.com/Agoric/agoric-sdk
cd agoric-sdk
yarn install
yarn build
yarn link-cli ~/bin/agoric
agoric --version
```

> Quick start
> 

Before looking at contract deployment, let's get familiar with the commands involved in starting up the services needed for smart contracts to work. The basic and easiest development cycle is as follows:

```bash
# in agoric directory

agoric install
agoric start --reset -v
agoric open
agoric deploy <contract-deploy-script.js> <api-deploy-script>

# in frontend directory

yarn && yarn start
```

1. Agoric install will install any packages defined within the agoric directory.  You can add a new package via ‘yarn add <package>’ or by modifying the package.json file directly, then running agoric install (note that yarn install will not work in agoric subdirectories).
2. Agoric start will start an instance of the simulated chain, and deploy an Ag-solo process serving as a wallet.
3. Agoric open will open the wallet interface on a browser.
4. The last command involves running the frontend and will vary depending on your framework of choice.

These four commands are sufficient for running a chain with a single Ag-solo process, deploying our contracts to it, and opening the wallet interface. For a more flexible setup, each component can be run separately, as shown below.

> Chain
> 

The chain is the process in which Agoric services run, including Ag-solo machines. This guide will make use of Agoric’s simulation-chain alone, for integration with other chains see Dynamic IBC (Inter-Blockchain Communication Protocol), aka dIBC. ([https://github.com/Agoric/agoric-sdk/blob/master/packages/SwingSet/docs/networking.md](https://github.com/Agoric/agoric-sdk/blob/master/packages/SwingSet/docs/networking.md))

The simplest way to start an instance of a chain is via 

```bash
agoric start local-chain --reset --verbose
```

This will start a local simulated chain, allowing the developer to start up the other processes separately. Omit the —reset option if you want the chain state to be preserved across restarts. The —verbose flag will result in more detailed logs that can be useful when debugging.

> Ag-solo
> 

The Ag-solo process represents a user’s wallet. It is possible to deploy multiple Ag-solos to the same local chain, enabling multi-user testing. To start an Ag-solo use the following command: 

```bash
agoric start local-solo 8000 --reset --verbose
```

Note that the chain needs to be running in order for the Ag-solo to be deployed. The argument after local-solo allows you to choose the port used by the Ag-solo, in order to use multiple Ag-solo processes you must use different ports (default is 8000).

> Wallet
> 

Once the simulated chain is running, and the Ag-solo is deployed, the wallet interface can be opened via

```bash
agoric open --hostport=localhost:8000
```

This command will open your browser and navigate to [localhost:8000](http://localhost:8000), note that the port needs to match that of the deployed Ag-solo. For security reasons, the wallet interface is protected by an access token, meaning that manually navigating to localhost:8000 will not work. You must use the URL shown by the agoric open command:

```bash
❯ agoric open               
Launching wallet...
http://127.0.0.1:8000/wallet/#accessToken=s6Cl_JVmL3DE0E7iaFZdTj9lbCKemrFhkzo9d3oj8M0srIUfRsHy-4yIyO0iZuMQ
```

> Multiple User Setup
> 

The commands above make it possible to deploy multiple Ag-solos to a single simulated local chain but it can be a lot to keep track of, let’s write a simple make file that can help out with this

```bash
chain-reset:
	agoric start local-chain --reset --verbose

solo0-reset:
	agoric start local-solo 8000 --reset --verbose

solo1-reset:
	agoric start local-solo 8001 --reset --verbose

chain:
	agoric start local-chain --verbose

solo0:
	agoric start local-solo 8000 --verbose

solo1:
	agoric start local-solo 8001 --verbose

wallet0:
	agoric open --hostport=localhost:8000 --no-browser

wallet1:
	agoric open --hostport=localhost:8001 --no-browser
```

Then run the following make commands to start a two-user setup:

```bash
> make chain-reset
(new terminal)
> make solo0-reset
(new terminal)
> make solo1-reset
(new terminal)
> make wallet1 
> make wallet2
```

> Writing and deploying smart contracts
> 

Smart contracts are located under the /contract subdirectory and are written in JavaScript. The next chapter will cover contract structure and syntax in more detail, let's explore how they are deployed to Zoe, and how to interact with them from the frontend.

To deploy a contract, you must write a deployment script (in Javascript) to pass to the *agoric deploy* command, it takes our contract code, installs it on Zoe, and makes the installation publicly available. Most Agoric projects come with this script already, and often times you don’t need to make any adjustments to it. Here’s an example:

```
// @ts-check

import fs from 'fs';
import '@agoric/zoe/exported.js';
import { E } from '@endo/eventual-send';
import { resolve } from 'import-meta-resolve';

export default async function deployContract(
  homePromise,
  { bundleSource, pathResolve },
) {
  // Your off-chain machine (what we call an ag-solo) starts off with
  // a number of references, some of which are shared objects on chain, and
  // some of which are objects that only exist on your machine.

  // Let's wait for the promise to resolve.
  const home = await homePromise;

  // Unpack the references.
  const {
    // *** ON-CHAIN REFERENCES ***

    // Zoe lives on-chain and is shared by everyone who has access to
    // the chain. In this demo, that's just you, but on our testnet,
    // everyone has access to the same Zoe.
    zoe,

    // The board is an on-chain object that is used to make private
    // on-chain objects public to everyone else on-chain. These
    // objects get assigned a unique string id. Given the id, other
    // people can access the object through the board. Ids and values
    // have a one-to-one bidirectional mapping. If a value is added a
    // second time, the original id is just returned.
    board,
  } = home;

  // First, we must bundle up our contract code (./src/contract.js)
  // and install it on Zoe. This returns an installationHandle, an
  // opaque, unforgeable identifier for our contract code that we can
  // reuse again and again to create new, live contract instances.
  const bundle = await bundleSource(pathResolve(`./src/index.js`));
  const installation = await E(zoe).install(bundle);

  // Let's share this installation with other people, so that
  // they can run our contract code by making a contract
  // instance (see the api deploy script in this repo to see an
  // example of how to use the installation to make a new contract
  // instance.)

  // To share the installation, we're going to put it in the
  // board. The board is a shared, on-chain object that maps
  // strings to objects.
  const CONTRACT_NAME = 'NAME';
  const INSTALLATION_BOARD_ID = await E(board).getId(installation);

  console.log('- SUCCESS! contract code installed on Zoe');
  console.log(`-- Contract Name: ${CONTRACT_NAME}`);
  console.log(`-- Installation Board Id: ${INSTALLATION_BOARD_ID}`);

  // Save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    CONTRACT_NAME,
    INSTALLATION_BOARD_ID,
  };
  const defaultsFolder = pathResolve(`../../frontend/src/service/conf`);
  const defaultsFile = pathResolve(
    `../../frontend/src/service/conf/installation-constants.js`,
  );
  console.log('writing', defaultsFile);
  const defaultsContents = `\
// GENERATED FROM ${pathResolve('./deploy.js')}
export default ${JSON.stringify(dappConstants, undefined, 2)};
`;
  await fs.promises.mkdir(defaultsFolder, { recursive: true });
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}
```

This can look daunting before becoming familiar with the concepts of Zoe and the Board, but  what’s important to understand is:

1. Installing contract code does *not* mean you start a new instance of that contract, it simply makes it available to actors wishing to start one (this is done in the next step)
2. References to deployed contracts are stored in a file for other parts of the stack to locate. You are welcome to export this file to any location, but keep in mind it will need to be accessed by the API deployment script, as well as the frontend app

After the contract code is installed and references to it are exported to a file, you can run the API deployment script in order to create an instance of the contract via the reference file from the previous step. The API deployment script is located in the /api subdirectory. Depending on your contract, the code to initialize an instance may vary, but let's look at a simple example:

```jsx
// @ts-check

// Agoric Dapp api deployment script

import fs from 'fs';
import { E } from '@endo/eventual-send';
import '@agoric/zoe/exported.js';

import installationConstants from '../ui/public/conf/installationConstants.js';

// deploy.js runs in an ephemeral Node.js outside of swingset.
// Once the deploy.js script ends, connections to any of
// its objects are severed.

const API_PORT = process.env.API_PORT || '8000';

export default async function deployApi(
  homePromise,
  { bundleSource, pathResolve },
) {
  // Let's wait for the promise to resolve.
  const home = await homePromise;

  // Unpack the references.
  const {
    // *** ON-CHAIN REFERENCES ***

    // Zoe lives on-chain and is shared by everyone who has access to
    // the chain. In this demo, that's just you, but on our testnet,
    // everyone has access to the same Zoe.
    zoe,

    // The board is an on-chain object that is used to make private
    // on-chain objects public to everyone else on-chain. These
    // objects get assigned a unique string id. Given the id, other
    // people can access the object through the board. Ids and values
    // have a one-to-one bidirectional mapping. If a value is added a
    // second time, the original id is just returned.
    board,
  } = home;

  // To get the backend of our dapp up and running, first we need to
  // grab the installation that our contract deploy script put
  // in the public board.
  const { INSTALLATION_BOARD_ID, CONTRACT_NAME } = installationConstants;
  const installation = await E(board).getValue(INSTALLATION_BOARD_ID);

  // Second, we can use the installation to create a new instance of
  // our contract code on Zoe. A contract instance is a running
  // program that can take offers through Zoe. Making an instance will
  // give us a `creatorFacet` that will let us make invitations we can
  // send to users.

  const { creatorFacet, instance, publicFacet } = await E(zoe).startInstance(
    installation,
  );

  console.log('- SUCCESS! contract instance is running on Zoe');

  const [INSTANCE_BOARD_ID] =
    await Promise.all([
      E(board).getId(instance),
    ]);

  console.log(`-- Contract Name: ${CONTRACT_NAME}`);
  console.log(`-- INSTANCE_BOARD_ID: ${INSTANCE_BOARD_ID}`);

  const API_URL = process.env.API_URL || `http://127.0.0.1:${API_PORT || 8000}`;

  // Re-save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    INSTANCE_BOARD_ID,
    INSTALLATION_BOARD_ID,
    // BRIDGE_URL: 'agoric-lookup:https://local.agoric.com?append=/bridge',
    BRIDGE_URL: 'http://127.0.0.1:8000',
    API_URL,
  };
  const defaultsFile = pathResolve(`../ui/public/conf/defaults.js`);
  console.log('writing', defaultsFile);
  const defaultsContents = `\
// GENERATED FROM ${pathResolve('./deploy.js')}
export default ${JSON.stringify(dappConstants, undefined, 2)};
`;
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}
```

The pattern is very similar to the contract deploy script, only instead of installing contract code, it uses the reference to the installation to start an instance, and stores a reference to that instance in an external file, to be used by the frontend.

> Frontend Integration
> 

Once deployment of contracts and API is complete, all that’s left is to configure the frontend to interact with the wallet and Zoe. The local bridge handles this via a web-socket connection and, at the time of writing, there is no official or recommended way to set up the frontend for this, in part due to the fact that Agoric can be used with any web framework, or plain HTML, CSS and JS. That said, there are a few dapp examples on Agoric’s Github that can be used for inspiration:

# 3. KREAd Character Builder

Chapter 3 showcases a composable NFT dapp built-in Agoric

> The concept
> 

The Character Builder dApp enables the minting of NFTs representing a character that can hold other NFTs in its inventory. Each character NFT can hold a number of items, which are visual accessories such as hair, mask, or background. Items are NFTs and can be owned by users, just like characters. Unlike other NFTs, however, they can be equipped to a character NFT in order to change the character's appearance and properties. These assets can be sold and bought via a central marketplace or traded freely on other Agoric NFT dApps. Due to the composition aspect, when a character is transferred, access to its inventory is granted to the owner.

> Architecture
> 

A few things to consider when designing an Agoric application:

1. Contract composability: while it’s possible to write your entire app in a custom smart contract, it’s worth checking for existing contracts that can support your dapp. For example, when developing a marketplace application, instead of writing the sell/buy logic in a single contract, you could have a contract that uses Agoric’s sellItems contract for listing assets. Perhaps later on you want to allow free trading, making Agoric’s barterExchange contract a good fit. On that note, if you do write custom code to cover certain logic, consider making it flexible enough to be used by other developers.
2. Offer safety guarantees: it is entirely possible to write an Agoric app without enforcing offer safety. This would, however, require a level of trust from the users that could otherwise be mitigated by offer safety. For example, when a user accepts an offer proposal with an empty “want” property, they have no guarantee that any assets will be sent to their wallet. If the “want” property is properly formed, Offer Safety can ensure they get what they expect.
3. Thinking in terms of assets: identity in Agoric is different than web2 and most web3 solutions, rather than examining a user's credentials, it encourages the use of objects as a way to represent privileges or access across dApps. The added benefit is the ability to easily trade positions by transferring such objects. This opens up a lot of design options, do take the time to explore the possibilities.

> Quick start
> 

The following sections will explain the code that makes up the Kread Character Builder, along with some design decisions and useful patterns. To follow along, clone the repo and run the following commands to run the dApp.

```bash
git clone <CHARACTER BUILDER REPO>

### Terminal 1 - ./agoric
agoric install
agoric start -v --reset

### Terminal 2 - ./agoric
agoric deploy contract/kread-deploy-contract.js api/kread-deploy-api.js
agoric open --repl

### Terminal 3 - ./frontend
# Remove `type: module` from `package.json`
yarn start
```

> Project structure
> 

The Krea project is organized in two main directories:

1. /agoric: Agoric SDK, and two subdirectories:
    1. /contract: contract code + contract deployment script
    2. /api: api deployment script 
2. /frontend: React application including the dapp UI, local-bridge web-socket connection, and constants file generated by the deployment scripts

Many example dapps provided by Agoric include the frontend code within the Agoric directory, and while this is completely valid, moving it outside can ease up conflicting yarn/npm configs between Agoric and your frontend solution of choice. 

> Contract initialization
> 

Often times, contracts will require external data to operate. For example, a fungible token contract might prompt whoever instantiates it for a string to be used as the token name. That way, rather than hardcoding a token name in the code and forcing all instances to use it, users can pass a custom name, effectively customizing the asset and making it much more reusable.

For the Krea dapp, the contract requires a config object to be populated for most features to work. The function `initConfig` takes in the necessary input and stores it in the contract state. This function can be made available via the Creator Facet, allowing only the actor creating the instance to configure the app. (Note: code types and documentation is written in JSDoc)

```jsx
 /**
   * Set contract configuration, required for most contract features,
   * base characters will be picked at random on new mint
   * default items will be minted along each character
   * seed is used to init the PRNG
   *
   * @param {{
   *   baseCharacters: any[],
   *   defaultItems: any[],
   *   seed: number
   *   chainTimerService: TimerService
   * }} config
   * @returns {string}
   */
  const initConfig = ({
    baseCharacters,
    defaultItems,
    seed,
    chainTimerService,
  }) => {
    STATE.config = {
      baseCharacters,
      defaultItems,
      chainTimerService,
			completed: true,
    };
    assert(!Number.isNaN(seed), X`${errors.seedInvalid}`);
    PRNG = mulberry32(seed);
    STATE.randomNumber = PRNG;
    return 'Setup completed';
  };

[...]

const creatorFacet = Far('Kread Character Builder - Creator Facet', {
    initConfig,
});
```

With composability in mind, rather than hardcoding NFT data on the contract layer, we allow the contract to receive an array of objects containing each base character and default items when initialized. This means anyone can deploy an instance of this contract to using their own set of NFT data. The api-deployment script is a good place to define and pass such data to the contract, by simply calling the initConfig function:

```jsx
await E(kreadCreatorFacet).initConfig({
      baseCharacters: updatedDefaultCharacters,
      defaultItems: updatedDefaultItems,
      chainTimerService,
    }),
```

Note that the initConfig function also adds a “completed” flag to the config object, this can be used to refuse calls to the contract until it has been configured. One way to do this is using Agoric’s *assert* function as shown below.

```jsx
import { assert } from '@agoric/assert';

const configDependentFn = () => {
	// throws if config incomplete
	assert(STATE.config?.completed, `Configuration not found, use creatorFacet.initConfig(<config>) to enable this method`);
};
```
