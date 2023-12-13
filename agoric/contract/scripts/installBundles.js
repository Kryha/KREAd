/* eslint-disable no-undef */
import { fromBech32 } from '@cosmjs/encoding';
import { SigningStargateClient, defaultRegistryTypes } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet, Registry, coins } from '@cosmjs/proto-signing';
import { Decimal } from '@cosmjs/math';
import { stringToPath } from '@cosmjs/crypto';
import { MsgInstallBundle } from '@agoric/cosmic-proto/swingset/msgs.js';
import * as fs from 'fs';

const RPC = 'http://localhost:26657';

const hdPath = (coinType = 118, account = 0) =>
  stringToPath(`m/44'/${coinType}'/${account}'/0/0`);

export const registry = new Registry([
  ...defaultRegistryTypes,
  ['/agoric.swingset.MsgInstallBundle', MsgInstallBundle],
]);

const Agoric = {
  Bech32MainPrefix: 'agoric',
  CoinType: 564,
};

const makeFeeObject = ({ denom, amount, gas }) => ({
  amount: coins(amount || 0, denom || 'uist'),
  gas: gas ? String(gas) : 'auto',
});

const initializeStargateClient = async (walletMnemonic) => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(walletMnemonic, {
    prefix: Agoric.Bech32MainPrefix,
    hdPaths: [hdPath(Agoric.CoinType, 0), hdPath(Agoric.CoinType, 1)],
  });

  return SigningStargateClient.connectWithSigner(RPC, wallet, {
    registry,
    gasPrice: {
      denom: 'uist',
      amount: Decimal.fromUserInput('50000000', 0),
    },
  });
};

async function installBundle() {
  const cosmicSwingsetPath = process.argv[2];
  const bundlePath = process.argv[3];

  const bundleText = await fs.readFileSync(bundlePath, 'utf-8');
  const walletAddress = (await fs.readFileSync(
    `${cosmicSwingsetPath}/t1/8000/ag-cosmos-helper-address`,
    'utf-8',
  )).trim();
  const walletMnemonic = (await fs.readFileSync(
    `${cosmicSwingsetPath}/t1/8000/ag-solo-mnemonic`,
    'utf-8',
  )).trim();

  const proposalMsg = {
    typeUrl: '/agoric.swingset.MsgInstallBundle',
    value: {
      bundle: bundleText,
      submitter: fromBech32(walletAddress).data,
    },
  };

  const stargateClient = await initializeStargateClient(
    walletMnemonic
  );

  if (!stargateClient) {
    throw new Error('stargateClient not found');
  }

  const estimate = await stargateClient.simulate(
    walletAddress,
    [proposalMsg],
    undefined,
  );
  const adjustment = 1.3;
  const gas = Math.ceil(estimate * adjustment);
  const txResult  = await stargateClient.signAndBroadcast(
    walletAddress,
    [proposalMsg],
    makeFeeObject({ gas }),
  );
  
  console.log(txResult)
}

await installBundle();
