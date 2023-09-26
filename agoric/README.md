# Contract deploy steps

To succesfully run the below steps making use of the makefile, it is important to have a local file `Makefile.paths.local` filled in with the required paths and addresses, an example can be found in `Makefile.paths`.

Steps to run:
ensure you are in the agoric folder otherwise cd to agoric folder

1. Start the chain
   1. make local-testnet
2. Update KEPLR_ADDRESS in Makefile.paths
   1. try to `make kread-committee`
   2. it will fail but look for `"sender","value":"agoric1` to find the address
      1. if it fails for another reason, you may need to run `make reset-client-local-testnet`
   3. copy that address into Makefile.paths.local for KEPLR_ADDRESS
3. fund the account
   1. make fund-account
4. make the committee
   1. make kread-committee
5. provision the fee collector wallet
   1. make provision-fee-collector
6. start the KREAd contract
   1. make clean start-kread

To confirm it started,

- in chain log you should see "CONTRACT INIT SUCCESS"
- after that `agd query vstorage children published` should include "kread"

If you encounter `Request would exceed mint limit` try `make fund-account`
