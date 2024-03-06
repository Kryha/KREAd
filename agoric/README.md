# Contract deploy steps

To succesfully run the below steps making use of the makefile, it is important to have a local file `Makefile.paths.local` filled in with the required paths and addresses, an example can be found in `Makefile.paths`.

These steps rely on a checkout of agoric-sdk representing the mainnet state, which should be branch `release-mainnet1B`. The `agoric-upgrade-11` and `agoric-upgrade-11wf` tags are not functional for this purpose as they have bugs preventing to start a local testnet correctly.

If the agoric-cli for that checkout of Agoric SDK is linked to any other command than `agoric`, you can set `AGORIC_CMD` in `Makefile.paths.local`, e.g. `agoric-11`.

Steps to run:
ensure you are in the agoric folder otherwise cd to agoric folder

1. Start the chain
   1. make local-testnet
2. make the committee
   1. make kread-committee
3. provision the fee collector wallet
   1. make provision-fee-collector
4. start the KREAd contract
   1. make clean start-kread

To confirm it started,

- in chain log you should see "CONTRACT INIT SUCCESS"
- after that `agd query vstorage children published` should include "kread"

If you encounter `Request would exceed mint limit` try `make fund-account`
