SDK_PATH =
COSMIC_SWINGSET_PATH =
VATS_PATH =
KEPLR_ADDRESS =
KEPLR_ADDRESS2 =
FEE_ADDRESS = agoric1d33wj6vgjfdaefs6qzda8np8af6qfdzc433dsu
KREAD_REPO =
EVAL_PERMIT =
EVAL_CODE =
EVAL_CLEAN =

include Makefile.paths.local

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

deploy:
	agoric deploy contract/kread-deploy-contract.js api/kread-deploy-api.js

kread-bundle:
	cd $(VATS_PATH); \
    yarn bundle-source --cache-json bundles/ ${KREAD_REPO} kread; \
	agoric publish --node 127.0.0.1:26657 bundles/bundle-kread.json --chain-id agoriclocal --home ../cosmic-swingset/t1/8000; \

local-testnet:
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-setup BASE_PORT=8000 NUM_SOLOS=0; \
	make scenario2-run-chain; \

client-local-testnet:
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-run-client BASE_PORT=8000; \

provision-account:
	cd $(COSMIC_SWINGSET_PATH); \
	make fund-provision-pool provision-acct ACCT_ADDR=$(KEPLR_ADDRESS) \

provision-fee-collector:
	cd $(COSMIC_SWINGSET_PATH); \
	make fund-provision-pool provision-acct ACCT_ADDR=$(FEE_ADDRESS) \

fund-account:
	cd $(COSMIC_SWINGSET_PATH); \
	make fund-acct ACCT_ADDR=$(KEPLR_ADDRESS) FUNDS=1000000000000uist; \
    make fund-acct ACCT_ADDR=$(KEPLR_ADDRESS) FUNDS=1000000000000ubld; \

fund-pool:
	cd $(COSMIC_SWINGSET_PATH); \
	make fund-provision-pool \

fund-account-atom:
	cd $(COSMIC_SWINGSET_PATH); \
	make fund-acct ACCT_ADDR=$(KEPLR_ADDRESS) FUNDS=100000000ibc/toyatom; \

proposal:
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-core-eval EVAL_PERMIT=$(EVAL_PERMIT) EVAL_CLEAN=$(EVAL_CLEAN) scenario2-vote \

proposal-2:
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-core-eval EVAL_PERMIT=$(EVAL_PERMIT) EVAL_CLEAN=$(EVAL_CLEAN) scenario2-vote VOTE_PROPOSAL=2 \

# note if you made changes to the contract code you must
# copy the resulting hash from kread-bundle into the proposal
# before running make proposal
bootstrap:
	make provision-account; \
    make fund-account; \
	make kread-bundle; \
	make proposal; \

fund+provision:
	make provision-account; \
    make fund-account; \
