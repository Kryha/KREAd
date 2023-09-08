export interface AgoricService {
  zoe: any;
  board: any;
  zoeInvitationDepositFacetId?: any;
  invitationIssuer: any;
  walletP: any;
  apiSend: any;
}

interface Contract {
  instance: any;
  publicFacet?: any;
}

interface Contracts {
  kread: Contract;
}

interface Status {
  walletConnected: boolean;
  dappApproved: boolean;
  showApproveDappModal: boolean;
}

export interface Purses {
  money: any[];
  character: any[];
  item: any[];
  token: any[];
}

export interface AgoricState {
  status: Status;
  contracts: Contracts;
  agoric: AgoricService;
  addOffer: any;
  walletConnection: WalletConnection;
  notifiers: NotifiersState;
  offers: any[];
  tokenInfo: TokenInfo;
  testCharacterInventory: any;
  isLoading: boolean;
  isReady: boolean;
  chainStorageWatcher: any;
}
export interface TokenInfo {
  character: { issuer: any; brand: any; petName?: string };
  item: { issuer: any; brand: any; petName?: string };
  ist: { issuer: any; brand: any; petName?: string };
}

export interface WalletConnection {
  pursesNotifier: any;
  makeOffer: any;
  publicSubscribersNotifier: any;
  leader: any;
  address: any;
  chainId: string;
  unserializer?: {
    fromCapData: any;
    serialize: any;
    toCapData: any;
    unserialize: any;
  };
  importContext: any;
}

interface NotifiersState {
  shop: {
    items: any;
    characters: any;
  };
}

interface SetDappApproved {
  type: "SET_DAPP_APPROVED";
  payload: boolean;
}

interface SetWalletConnected {
  type: "SET_WALLET_CONNECTED";
  payload: boolean;
}

interface SetShowApproveDappModal {
  type: "SET_SHOW_APPROVE_DAPP_MODAL";
  payload: boolean;
}

interface SetOffers {
  type: "SET_OFFERS";
  payload: any[];
}

interface SetAgoric {
  type: "SET_AGORIC";
  payload: Omit<AgoricService, "apiSend">;
}

interface SetKreadContract {
  type: "SET_KREAD_CONTRACT";
  payload: Contract;
}

interface SetApiSend {
  type: "SET_APISEND";
  payload: any;
}

interface SetLoading {
  type: "SET_LOADING";
  payload: boolean;
}

interface SetTokenInfo {
  type: "SET_TOKEN_INFO";
  payload: TokenInfo;
}

interface SetAddOffer {
  type: "SET_ADD_OFFER";
  payload: any;
}

interface SetWalletConnection {
  type: "SET_WALLET_CONNECTION";
  payload: any;
}

interface SetChainStorageWatcher {
  type: "SET_CHAIN_STORAGE_WATCHER";
  payload: any;
}

interface SetTestCharacter {
  type: "SET_TEST_CHARACTER";
  payload: any;
}

interface SetMarketplaceMetricsWatcher {
  type: "SET_MARKETPLACE_METRICS_WATCHER";
  payload: any;
}

interface Reset {
  type: "RESET";
}

export type PursePetname = [string, string];

export type AgoricDispatch = React.Dispatch<AgoricStateActions>;

export type AgoricStateActions =
  | Reset
  | SetDappApproved
  | SetWalletConnected
  | SetShowApproveDappModal
  | SetAgoric
  | SetKreadContract
  | SetApiSend
  | SetLoading
  | SetTokenInfo
  | SetAddOffer
  | SetWalletConnection
  | SetChainStorageWatcher
  | SetTestCharacter
  | SetMarketplaceMetricsWatcher
  | SetOffers;

export interface OfferProposal {
  give: Object;
  want: Object;
}
