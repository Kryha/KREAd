FEE_ADDRESS = agoric1d33wj6vgjfdaefs6qzda8np8af6qfdzc433dsu

# config options
KREAD_REPO =
SDK_PATH =
KEPLR_ADDRESS =
include Makefile.paths.local

COSMIC_SWINGSET_PATH = $(SDK_PATH)/packages/cosmic-swingset
VATS_PATH = $(SDK_PATH)/packages/vats

EVAL_PERMIT = $(KREAD_REPO)/agoric/contract/src/proposal/powers.json
EVAL_CODE = $(KREAD_REPO)/agoric/contract/src/proposal/chain-storage-proposal.js
EVAL_CLEAN = $(EVAL_CODE)-clean.js
KR_AG_DIR = $(KREAD_REPO)/agoric
PROP_DIR = $(KR_AG_DIR)/contract/src/proposal

LAST_PROPOSAL=`agd query gov proposals --output json | jq -cr '.proposals[-1] | [.proposal_id][0]'`

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

dist/.keep dist/bundles/.keep:
	mkdir -p dist/bundles
	touch dist/.keep dist/bundles/.keep
	@echo bundles will actually be stored in $(PWD)/dist/bundles
	rm -rf $(HOME)/.agoric/cache
	ln -s $(PWD)/dist/bundles $(HOME)/.agoric/cache

build-proposals: dist/kread-committee-info.json dist/start-kread-info.json

dist/kread-invite-committee-permit.json dist/kread-invite-committee.js dist/kread-committee-info.json: dist/.keep \
		contract/src/proposal/kread-committee-script.js
	cd dist && agoric run ../contract/src/proposal/kread-committee-script.js >kread-committee-info.txt
	node contract/scripts/parseProposals.js <dist/kread-committee-info.txt >dist/kread-committee-info.json \
		|| rm dist/kread-committee-info.json

dist/start-kread-permit.json dist/start-kread.js dist/start-kread-info.json: dist/.keep \
		contract/src/proposal/start-kread-script.js
	cd dist && agoric run ../contract/src/proposal/start-kread-script.js >start-kread-info.txt
	node contract/scripts/parseProposals.js <dist/start-kread-info.txt >dist/start-kread-info.json \
		|| rm dist/start-kread-info.json

clean:
	rm -rf dist

# To start the KREAd contract:
# 1. start the chain using `make local-testnet'
# 2.  TBD ...  update KEPLR_ADDRESS in Makefile.paths
# 3. fund the account using `make fund-account`
# 4. make the committee using 'KREAD_COMMITTEE_NAME='kread' KREAD_COMMITTEE_ADDRESSES='{"voter": "agoric1ersatz"}' make kread-committee'
# 5. make provision-fee-collector
# 6. start the KREAd contract using 'KREAD_COMMITTEE_NAME='kread' KREAD_COMMITTEE_ADDRESSES='{"voter": "agoric1ersatz"}' make start-kread'

kread-committee: dist/kread-committee-info.json
	jq -r '.bundles[]' dist/kread-committee-info.json | sort -u > kread-committee-bundles.out
	for b in `cat kread-committee-bundles.out` ; do \
	   agoric publish --node 127.0.0.1:26657 $$b --chain-id agoriclocal --home $(COSMIC_SWINGSET_PATH)/t1/8000 ; \
	done
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-core-eval EVAL_PERMIT=dist/kread-invite-committee-permit.json \
	   EVAL_CODE=$(PWD)/dist/kread-invite-committee.js EVAL_CLEAN=$(PWD)/dist/kread-invite-committee.js.t scenario2-vote VOTE_PROPOSAL=$(($LAST_PROPOSAL+1)) \

start-kread: dist/start-kread-info.json
	jq -r '.bundles[]' dist/start-kread-info.json | sort -u > start-kread-bundles.out
	for b in `cat start-kread-bundles.out` ; do \
	   agoric publish --node 127.0.0.1:26657 $$b --chain-id agoriclocal --home $(COSMIC_SWINGSET_PATH)/t1/8000 ; \
	done
	cd $(COSMIC_SWINGSET_PATH); \
	make scenario2-core-eval EVAL_PERMIT=$(PWD/dist/start-kread-permit.json \
	   EVAL_CODE=$(PWD)/dist/start-kread.js EVAL_CLEAN=$(PWD)/dist/start-kread.js.t scenario2-vote VOTE_PROPOSAL=$(($LAST_PROPOSAL+1)) \

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
