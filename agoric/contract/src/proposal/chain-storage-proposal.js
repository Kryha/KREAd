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
    detail: {
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
    detail: {
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
    detail: {
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
    detail: {
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
    level: 0.14 * 200 + 0,
    rarity: 0.12 * 400 + 10,
    effectiveness: 0.12 * 30 + 5,
    layerComplexity: 0.12 * 50 + 100,
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
    level: 0.12 * 200 + 0,
    rarity: 0.12 * 400 + 10,
    effectiveness: 0.12 * 30 + 5,
    layerComplexity: 0.12 * 50 + 100,
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
    level: 0.12 * 200 + 0,
    rarity: 0.12 * 400 + 10,
    effectiveness: 0.12 * 30 + 5,
    layerComplexity: 0.12 * 50 + 100,
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
    level: 0.12 * 200 + 0,
    rarity: 3,
    effectiveness: 0.12 * 30 + 5,
    layerComplexity: 0.12 * 50 + 100,
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
    level: 0.12 * 100 + 0,
    rarity: 0.12 * 400 + 10,
    effectiveness: 0.12 * 80 + 20,
    layerComplexity: 0.12 * 50 + 50,
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
    'b1-47de61f970d0b209f593f683f8bedbf503630dcc0b3bd0bda9da77322b85f3e8807b020d70b0a3dcb492d308acb31032ecb4b1922b18513866f634acc3f63584',
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
    consume: { board, chainStorage, zoe, chainTimerService },
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
  const kreadConfig = harden({
    defaultCharacters,
    defaultItems,
    chainTimerService,
  });

  const privateArgs = harden({ storageNode, marshaller, kreadConfig });

  const installation = await E(zoe).installBundleID(contractInfo.bundleID);
  const noIssuers = harden({});
  const noTerms = harden({});
  const facets = await E(zoe).startInstance(
    installation,
    noIssuers,
    noTerms,
    privateArgs,
  );

  const instance = await E(board).getId(facets.instance);
  console.log({ instance }); // We need this to get the board ID

  // Share instance widely via E(agoricNames).lookup('instance', <instance name>)
  kread.resolve(facets.instance);

  // Share the publicFacet, creatorFacet, and adminFacet in the bootstrap space
  // for use by other CoreEval behaviors.
  // kreadKit.resolve(kreadFacet);
};

harden(executeProposal);

// "export" the function as the script completion value
executeProposal;
