SDK_PATH =
COSMIC_SWINGSET_PATH =
VATS_PATH =
KEPLR_ADDRESS =
FEE_ADDRESS = agoric1d33wj6vgjfdaefs6qzda8np8af6qfdzc433dsu
KREAD_REPO =
KR_AG_DIR =
PROP_DIR = $(KR_AG_DIR)/contract/src/proposal

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

kread-committee:
	agoric run contract/src/proposal/kread-committee-script.js | tee kread-committee.out
	node contract/scripts/parseProposals.js < kread-committee.out | jq -r '.bundles[]' | sort -u > kread-committee-bundles.out
	for b in `cat kread-committee-bundles.out` ; do \
	   agoric publish --node 127.0.0.1:26657 $$b --chain-id agoriclocal --home $(COSMIC_SWINGSET_PATH)/t1/8000 ; \
	done
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-core-eval EVAL_PERMIT=$(KR_AG_DIR)/kread-invite-committee-permit.json \
	   EVAL_CODE=$(KR_AG_DIR)/kread-invite-committee.js EVAL_CLEAN=$(KR_AG_DIR)/kread-invite-committee.js.t scenario2-vote VOTE_PROPOSAL=3 \

start-kread:
	agoric run contract/src/proposal/start-kread-script.js | tee start-kread.out
	node contract/scripts/parseProposals.js < start-kread.out | jq -r '.bundles[]' | sort -u > start-kread-bundles.out
	for b in `cat start-kread-bundles.out` ; do \
	   agoric publish --node 127.0.0.1:26657 $$b --chain-id agoriclocal --home $(COSMIC_SWINGSET_PATH)/t1/8000 ; \
	done
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-core-eval EVAL_PERMIT=$(KR_AG_DIR)/start-kread-permit.json \
	   EVAL_CODE=$(KR_AG_DIR)/start-kread.js EVAL_CLEAN=$(KR_AG_DIR)/start-kread.js.t scenario2-vote VOTE_PROPOSAL=4 \
	   EVAL_CODE=$(KR_AG_DIR)/start-kread.js EVAL_CLEAN=$(KR_AG_DIR)/start-kread.js.t scenario2-vote VOTE_PROPOSAL=16 \

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
