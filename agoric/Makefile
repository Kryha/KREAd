SDK_PATH = ../..
COSMIC_SWINGSET_PATH = ../../agoric-sdk/packages/cosmic-swingset
VATS_PATH = ../../agoric-sdk/packages/vats

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

# TODO: add json attribute and remove
deploy:
	agoric deploy contract/kread-deploy-contract.js api/kread-deploy-api.js

kread-bundle: 
	cd $(VATS_PATH); \
  yarn bundle-source --cache-json bundles/ ../../../REPO/agoric/contract/src/index.js kread; \
	agoric publish --node 127.0.0.1:26657 bundles/bundle-kread.json --chain-id agoriclocal --home ../cosmic-swingset/t1/8000; \

start-local-testnet:
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-setup BASE_PORT=8000 NUM_SOLOS=0; \
	make scenario2-run-chain; \
 
run-client-local-testnet:
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-run-client BASE_PORT=8000; \

run-proposal:
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-core-eval scenario2-vote