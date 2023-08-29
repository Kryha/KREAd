/**
 * @file
 *
 * This is a script for use with swingset.CoreEval.
 *
 * It's a script, not a module, so we can't use `import`.
 * But E, Far, etc. are in scope, provided by the
 * `new Compartment(globals)` call in
 * `bridgeCoreEval()` in packages/vats/src/core/chain-behaviors.js
 */
// @ts-check
// uncomment the following line to typecheck, for example, in vs-code.
// import { E } from '@endo/far';

const defaultCharacters = [
  {
    title: 'character 1',
    type: 'tempetScavenger',
    description:
      'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
    level: 1,
    details: {
      boardId: '06553',
      contractAddresss: '0x0177812bsjs7998',
      standard: 'standard',
      artist: 'emily',
      metadata: 'https://yourmetadata.info',
    },
    projectDescription: 'this is a project',
    image:
      'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
  },
  {
    title: 'character 2',
    type: 'tempetScavenger',
    description:
      'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
    level: 1,
    details: {
      boardId: '06553',
      contractAddresss: '0x0177812bsjs7998',
      standard: 'standard',
      artist: 'emily',
      metadata: 'https://yourmetadata.info',
    },
    projectDescription: 'this is a project',
    image:
      'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
  },
  {
    title: 'character 3',
    url: 'https://builder.agoric.kryha.dev/static/media/default-character.216ad02c.png',
    type: 'tempetScavenger',
    description:
      'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
    level: 1,
    details: {
      boardId: '06553',
      contractAddresss: '0x0177812bsjs7998',
      standard: 'standard',
      artist: 'emily',
      metadata: 'https://yourmetadata.info',
    },
    projectDescription: 'this is a project',
    image:
      'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
  },
  {
    title: 'character 4',
    url: 'https://builder.agoric.kryha.dev/static/media/default-character.216ad02c.png',
    type: 'tempetScavenger',
    description:
      'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
    level: 1,
    details: {
      boardId: '06553',
      contractAddresss: '0x0177812bsjs7998',
      standard: 'standard',
      artist: 'emily',
      metadata: 'https://yourmetadata.info',
    },
    projectDescription: 'this is a project',
    image:
      'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
  },
];
const defaultItems = {
  noseline: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'noseline',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmayqpgHTDQ8qQCWv8DPax2mfhtXey3kmzWqEBHdphyAZx',
    thumbnail:
      'https://ipfs.io/ipfs/QmeSU6u5jQgcjfTyQuhwjqaFgM5vZmZeoxYPBTeEev9ALs',
    level: 5,
    rarity: 2,
    effectiveness: 3,
    layerComplexity: 5,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06149',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  midBackground: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'midBackground',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmTdg7MpcL3rKfLiBAfLkedBp74uPKx3CTGrYdwARspy4e',
    thumbnail:
      'https://ipfs.io/ipfs/QmS3fkmVaToE7imZn9jtMZMbSTTeeyGZBHLocUUw7u5z4T',
    level: 54,
    rarity: 35,
    effectiveness: 4,
    layerComplexity: 6,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#7B5B7B'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06119',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  mask: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'mask',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmadebCRvkLSHdeSTnPJv58XHtjk5DwYbeUigNNcWPs2Vn',
    thumbnail:
      'https://ipfs.io/ipfs/QmYmyyNeoyeAQ8qPHkufum848mA1P5Q1KHZp7n6vhwGsgd',
    level: 34,
    rarity: 4,
    effectiveness: 5,
    layerComplexity: 400,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06139',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  headPiece: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'headPiece',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/Qmb1ZXVuJifqQ28fEqiSEB7kgXXRqKfwYA7CD4aeLUbrtR',
    thumbnail:
      'https://ipfs.io/ipfs/QmciQkft6W2oZeGQuahosN5LaBawXYkJZTVq8VCEMLZVVG',
    level: 340,
    rarity: 4,
    effectiveness: 404,
    layerComplexity: 5000,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06118',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  hair: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'hair',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmdMyDHeudz3RJDFbrwgAvtC2Kx6rmcMbbF85hyqnnNcfE',
    thumbnail:
      'https://ipfs.io/ipfs/QmPQbf3NkPbSv6HABKPeEkbGdsoXVyVnpY5kXY3mS8Q4yR',
    level: 4555,
    rarity: 53,
    effectiveness: 45,
    layerComplexity: 100,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06117',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  frontMask: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'frontMask',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmS5TvnX9PMobuME6bLuuDWR4avhGGeuHg7eAFfZAiLLZ1',
    thumbnail:
      'https://ipfs.io/ipfs/QmS1X4KRtcumk4PqjowgKsbMh2uN79wwUsYYKnakqr7FZn',
    level: 3440,
    rarity: 30,
    effectiveness: 3405,
    layerComplexity: 0.12 * 50 + 100,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06116',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  liquid: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'liquid',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmP7iMiQLRWy1fF8yLXR5xQg1kpEqzy19uwzEJxxZmGUjS',
    thumbnail:
      'https://ipfs.io/ipfs/QmcVTwEMR8XzsF8hThYMpajTb6oL7TtvfuH3MEpwyvZUMi',
    level: 455,
    rarity: 3333,
    effectiveness: 234,
    layerComplexity: 3,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06115',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  background: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'background',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmaYb31m9CRTKJQzVgi2NaHfPqdUTYuXQq5jLzTbTa2YVx',
    thumbnail:
      'https://ipfs.io/ipfs/QmYRmByVnzK2D6akMDEfMj3LPLSJw15R9s9gdu9oGcEV7E',
    level: 40,
    rarity: 1,
    effectiveness: 3,
    layerComplexity: 50,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06114',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  airReservoir: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'airReservoir',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmdmgvWYz1bEdBH6eSTPCfkcjZQhZvbREYULGjJd4EQPZy',
    thumbnail:
      'https://ipfs.io/ipfs/QmZMyeV2dvMs9i5kjj9gCvmkvMz5nTBapmyKARk7dkbRqX',
    level: 0.12 * 200 + 0,
    rarity: 0.12 * 400 + 10,
    effectiveness: 0.12 * 30 + 5,
    layerComplexity: 0.12 * 50 + 100,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06113',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
  clothing: {
    name: 'AirTox: Fairy Dust Elite',
    category: 'clothing',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmShge9z81i5sRjgHUjH5EBwtKPvSRNap5JHbp4imLgJ4H',
    thumbnail:
      'https://ipfs.io/ipfs/QmdVLuhUPRvpHzmERTSsChHBexAhc6TUK6SPHsGnqQ7QaM',
    level: 1,
    rarity: 2,
    effectiveness: 35,
    layerComplexity: 100,
    forged: 'Tempet Section 1',
    baseMaterial: 'Mars & Earth',
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    projectDescription:
      "In a far-future post-apocalyptic world, after multiple generations of war, we ended up with limited set of land, resources, water, and food. By leveraging decentralized technology humanity has found equilibrium in the management of global resources by decentrally managing the supply and demand based on everyone's contribution to the global ecosystem. The scavengers are the eyes and ears outside the city walls called the wildland.Carrying the most advanced technology allowed by the city counsels.Modified For: survival, traceability, stealth, and attack. Scavengers are usually promoted to bounty hunters of the state.Carrying out justice on their behalf in the wildlands.",
    details: {
      boardId: '06112',
      brand: '0x0177812bsjs7998',
      artist: 'Enmanuel',
      metadata: 'https://yourmetadata.com',
    },
  },
};

const contractInfo = {
  storagePath: 'kread',
  instanceName: 'kread',
  // see discussion of publish-bundle and bundleID
  // from Dec 14 office hours
  // https://github.com/Agoric/agoric-sdk/issues/6454#issuecomment-1351949397
  bundleID:
    'b1-58c49ffa0b38a8d7fe7fdf196b8d13d74a0acfde5d579b00fb05cdc9c404789c3d9a4b6a7ae1fa3ff160372a310ab720288d33b575e0bc1bc45f374e6b20ca61',
};

const fail = (reason) => {
  throw reason;
};

/**
 * Execute a proposal to start a contract that publishes bake sales.
 *
 * See also:
 * BLDer DAO governance using arbitrary code injection: swingset.CoreEval
 * https://community.agoric.com/t/blder-dao-governance-using-arbitrary-code-injection-swingset-coreeval/99
 *
 * @param {BootstrapPowers} powers see the `behavior(powers)` call
 *   in `bridgeCoreEval()`
 */
const executeProposal = async (powers) => {
  // Destructure the powers that we use.
  // See also bakeSale-permit.json
  const {
    consume: {
      board,
      chainStorage,
      zoe,
      startUpgradable,
      chainTimerService,
      agoricNamesAdmin,
      agoricNames,
    },
    // @ts-expect-error bakeSaleKit isn't declared in vats/src/core/types.js
    produce: { kreadKit },
    instance: {
      // @ts-expect-error bakeSaleKit isn't declared in vats/src/core/types.js
      produce: { [contractInfo.instanceName]: kread },
    },
  } = powers;

  const chainStorageSettled =
    (await chainStorage) || fail(Error('no chainStorage - sim chain?'));
  const storageNode = E(chainStorageSettled).makeChildNode(
    contractInfo.storagePath,
  );
  const marshaller = await E(board).getReadonlyMarshaller();
  const kreadPowers = { storageNode, marshaller };
  const settledTimer = await chainTimerService;
  const kreadConfig = harden({
    defaultCharacters,
    defaultItems,
    chainTimerService,
    seed: 303,
  });
  const istIssuer = await E(agoricNames).lookup('issuer', 'IST');

  const privateArgs = harden({ powers: kreadPowers, ...kreadConfig });

  const installation = await E(zoe).installBundleID(contractInfo.bundleID);
  const issuers = harden({ Money: istIssuer });
  // TODO: add terms indicating the keywordRecords used within our offers
  const noTerms = harden({});

  const { instance, creatorFacet, publicFacet } = await E(startUpgradable)({
    installation,
    label: 'KREAd',
    issuers,
    privateArgs,
    noTerms,
  });

  // Get board ids for instance and assets
  const boardId = await E(board).getId(instance);
  const {
    character: { issuer: characterIssuer, brand: characterBrand },
    item: { issuer: itemIssuer, brand: itemBrand },
    payment: { issuer: tokenIssuer, brand: tokenBrand },
  } = await E(publicFacet).getTokenInfo();

  const [
    CHARACTER_BRAND_BOARD_ID,
    CHARACTER_ISSUER_BOARD_ID,
    ITEM_BRAND_BOARD_ID,
    ITEM_ISSUER_BOARD_ID,
    TOKEN_BRAND_BOARD_ID,
    TOKEN_ISSUER_BOARD_ID,
  ] = await Promise.all([
    E(board).getId(characterBrand),
    E(board).getId(characterIssuer),
    E(board).getId(itemBrand),
    E(board).getId(itemIssuer),
    E(board).getId(tokenBrand),
    E(board).getId(tokenIssuer),
  ]);

  const assetBoardIds = {
    character: {
      issuer: CHARACTER_ISSUER_BOARD_ID,
      brand: CHARACTER_BRAND_BOARD_ID,
    },
    item: { issuer: ITEM_ISSUER_BOARD_ID, brand: ITEM_BRAND_BOARD_ID },
    paymentFT: { issuer: TOKEN_ISSUER_BOARD_ID, brand: TOKEN_BRAND_BOARD_ID },
  };

  await E(creatorFacet).publishKreadInfo(
    boardId,
    CHARACTER_BRAND_BOARD_ID,
    CHARACTER_ISSUER_BOARD_ID,
    ITEM_BRAND_BOARD_ID,
    ITEM_ISSUER_BOARD_ID,
    TOKEN_BRAND_BOARD_ID,
    TOKEN_ISSUER_BOARD_ID,
  );
  // Log board ids for use in frontend constants
  console.log(`KREAD BOARD ID: ${boardId}`);
  for (const [key, value] of Object.entries(assetBoardIds)) {
    console.log(`${key.toUpperCase()} BRAND BOARD ID: ${value.brand}`);
    console.log(`${key.toUpperCase()} ISSUER BOARD ID: ${value.issuer}`);
  }

  //Share instance widely via E(agoricNames).lookup('instance', <instance name>)
  kread.resolve(instance);

  const kindAdmin = (kind) => E(agoricNamesAdmin).lookupAdmin(kind);

  await E(kindAdmin('issuer')).update('KREAdCHARACTER', characterIssuer);
  await E(kindAdmin('brand')).update('KREAdCHARACTER', characterBrand);

  await E(kindAdmin('issuer')).update('KREAdITEM', itemIssuer);
  await E(kindAdmin('brand')).update('KREAdITEM', itemBrand);

  console.log('ASSETS ADDED TO AGORIC NAMES');
  // Share instance widely via E(agoricNames).lookup('instance', <instance name>)
};

harden(executeProposal);

// "export" the function as the script completion value
executeProposal;

//# sourceURL=/Users/wietzes/Documents/cosmos/Agoric/agoric/contract/src/proposal/chain-storage-proposal.js
