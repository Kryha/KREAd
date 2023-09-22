# KREAd deploy steps

To succesfully run the below steps making use of the makefile, it is important to have a local file `Makefile.paths.local` filled in with the required paths and addresses, an example can be found in `Makefile.paths`.

Steps to run:
ensure you are in the agoric folder otherwise cd to agoric folder

```sh
cd agoric
```

run agoric install

```sh
agoric install
```

run chain from:

```sh
make local-testnet
```

run client for chain:

```sh
make client-local-testnet
```

create kread-bundle and publish it to chain (this step requires the `client-local-testnet` otherwise it has no address to bundle and publish from):

```sh
make kread-bundle
```

provision the account that is in the core eval proposal ('agoric1d33wj6vgjfdaefs6qzda8np8af6qfdzc433dsu')

```sh
make provision-fee-collector
```

create and vote on proposal

```sh
make proposal
```

The proposal logs some board_id information to chain-logs which can be used to verify it ran correctly.

Vstorage should contain the following after startup:

- kread bundle in bundles
- kread instance in agoricNames/instances
- KREAdCHARACTER and KREAdITEM brands in agoricNames/brands
- kread storage path with kread-info populated with boardIds
