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

const baseCharacters = [
  [
    1,
    {
      title: 'Citizen',
      origin: 'Sage',
      description:
        'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
      level: 1,
      artistMetadata: '',
      characterTraits: '',
      image:
        'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
    },
  ],
  [
    2,
    {
      title: 'Scavenger',
      origin: 'Tempet',
      description:
        'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
      level: 1,
      artistMetadata: '',
      characterTraits: '',
      image:
        'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
    },
  ],
  [
    3,
    {
      title: 'Bounty Hunter',
      origin: 'Mars',
      description:
        'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
      level: 1,
      artistMetadata: '',
      characterTraits: '',
      image:
        'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
    },
  ],
  [
    4,
    {
      title: 'State Bounty Hunter',
      origin: 'Elphia',
      description:
        'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
      level: 1,
      artistMetadata: '',
      characterTraits: '',
      image:
        'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
    },
  ],
  [
    5,
    {
      title: 'Council Member',
      origin: 'Arm',
      url: 'https://builder.agoric.kryha.dev/static/media/default-character.216ad02c.png',
      description:
        'A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.',
      level: 1,
      artistMetadata: '',
      characterTraits: '',
      image:
        'https://ipfs.io/ipfs/QmSkCL11goTK7qw1qLjbozUJ1M7mJtSyH1PnL1g8AB96Zg',
    },
  ],
];

const baseItems = [
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'perk1',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    origin: 'Elphia',
    image:
      'https://ipfs.io/ipfs/QmayqpgHTDQ8qQCWv8DPax2mfhtXey3kmzWqEBHdphyAZx',
    thumbnail:
      'https://ipfs.io/ipfs/QmeSU6u5jQgcjfTyQuhwjqaFgM5vZmZeoxYPBTeEev9ALs',
    rarity: 18,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'patch',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmTdg7MpcL3rKfLiBAfLkedBp74uPKx3CTGrYdwARspy4e',
    thumbnail:
      'https://ipfs.io/ipfs/QmS3fkmVaToE7imZn9jtMZMbSTTeeyGZBHLocUUw7u5z4T',
    rarity: 18,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#7B5B7B'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'perk2',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmadebCRvkLSHdeSTnPJv58XHtjk5DwYbeUigNNcWPs2Vn',
    thumbnail:
      'https://ipfs.io/ipfs/QmYmyyNeoyeAQ8qPHkufum848mA1P5Q1KHZp7n6vhwGsgd',
    rarity: 18,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'headPiece',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/Qmb1ZXVuJifqQ28fEqiSEB7kgXXRqKfwYA7CD4aeLUbrtR',
    thumbnail:
      'https://ipfs.io/ipfs/QmciQkft6W2oZeGQuahosN5LaBawXYkJZTVq8VCEMLZVVG',
    rarity: 18,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'filter2',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmdmgvWYz1bEdBH6eSTPCfkcjZQhZvbREYULGjJd4EQPZy',
    thumbnail:
      'https://ipfs.io/ipfs/QmZMyeV2dvMs9i5kjj9gCvmkvMz5nTBapmyKARk7dkbRqX',
    rarity: 18,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'garment',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmShge9z81i5sRjgHUjH5EBwtKPvSRNap5JHbp4imLgJ4H',
    thumbnail:
      'https://ipfs.io/ipfs/QmdVLuhUPRvpHzmERTSsChHBexAhc6TUK6SPHsGnqQ7QaM',
    rarity: 65,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'hair',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmdMyDHeudz3RJDFbrwgAvtC2Kx6rmcMbbF85hyqnnNcfE',
    thumbnail:
      'https://ipfs.io/ipfs/QmPQbf3NkPbSv6HABKPeEkbGdsoXVyVnpY5kXY3mS8Q4yR',
    rarity: 65,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'filter1',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    origin: 'elphia',
    image:
      'https://ipfs.io/ipfs/QmP7iMiQLRWy1fF8yLXR5xQg1kpEqzy19uwzEJxxZmGUjS',
    thumbnail:
      'https://ipfs.io/ipfs/QmcVTwEMR8XzsF8hThYMpajTb6oL7TtvfuH3MEpwyvZUMi',
    rarity: 18,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
  {
    name: 'AirTox: Fairy Dust Elite',
    category: 'background',
    functional: false,
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmaYb31m9CRTKJQzVgi2NaHfPqdUTYuXQq5jLzTbTa2YVx',
    thumbnail:
      'https://ipfs.io/ipfs/QmYRmByVnzK2D6akMDEfMj3LPLSJw15R9s9gdu9oGcEV7E',
    rarity: 18,
    level: 0,
    filtering: 0,
    weight: 0,
    sense: 0,
    reserves: 0,
    durability: 0,
    colors: ['#B1A2A2', '#7B5B7B', '#968996', '#FFFFFF'],
    artistMetadata: '',
  },
];

const contractInfo = {
  storagePath: 'kread',
  instanceName: 'kread',
  // see discussion of publish-bundle and bundleID
  // from Dec 14 office hours
  // https://github.com/Agoric/agoric-sdk/issues/6454#issuecomment-1351949397
  bundleID:
    'b1-3c089ffa31bb785a63d871d8f6725896d45593b4bd4371336e2b785a8d258e97dbee474ce11563afc86a1245e5c2a9d6490139f13d5e8e3198f4fddc485d006a',
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
  const clock = await E(settledTimer).getClock();

  const kreadConfig = harden({
    clock,
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

  await E(creatorFacet).initializeBaseAssets(baseCharacters, baseItems);

  await E(creatorFacet).initializeMetrics();

  // TODO: Get the most recent state of metrics from the storage node and send it to the contract
  // const data = {};
  // const restoreMetricsInvitation = await E(
  //   creatorFacet,
  // ).makeRestoreMetricsInvitation();
  // await E(zoe).offer(restoreMetricsInvitation, {}, {}, data);

  // Revive seat exit subscribers after upgrade
  await E(creatorFacet).reviveMarketExitSubscribers();

  // Log board ids for use in frontend constants
  console.log(`KREAD BOARD ID: ${boardId}`);
  for (const [key, value] of Object.entries(assetBoardIds)) {
    console.log(`${key.toUpperCase()} BRAND BOARD ID: ${value.brand}`);
    console.log(`${key.toUpperCase()} ISSUER BOARD ID: ${value.issuer}`);
  }

  // Share instance widely via E(agoricNames).lookup('instance', <instance name>)
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
