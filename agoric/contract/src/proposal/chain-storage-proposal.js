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

export const baseCharacters = [
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

export const baseItems = [
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
    origin: 'Elphia',
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
    category: 'mask',
    functional: false,
    origin: 'Elphia',
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
    category: 'perk2',
    functional: false,
    origin: 'Elphia',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
    image:
      'https://ipfs.io/ipfs/QmS5TvnX9PMobuME6bLuuDWR4avhGGeuHg7eAFfZAiLLZ1',
    thumbnail:
      'https://ipfs.io/ipfs/QmS1X4KRtcumk4PqjowgKsbMh2uN79wwUsYYKnakqr7FZn',
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
    origin: 'Elphia',
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
    origin: 'Elphia',
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
    origin: 'Elphia',
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
    origin: 'Elphia',
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
    origin: 'Elphia',
    description:
      'This is an all-purpose air filter and air temperature regulator with minimal water analyzing technology. Suitable for warm hostile places, weather, and contaminated areas. Not so good for the dead zone.',
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
    origin: 'Elphia',
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
