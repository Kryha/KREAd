export interface AgoricService {
  zoe: any;
  board: any;
  zoeInvitationDepositFacetId?: any;
  invitationIssuer: any;
  walletP: any;
  apiSend: any;
}

interface Contracts {
  kread: {
    instance: any;
  }
}

interface Status {
  walletProvisioned: boolean;
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
  chainId: string;
  unserializer?: {
    fromCapData: any;
    serialize: any;
    toCapData: any;
    unserialize: any;
  };
  importContext: any;
  provisionSmartWallet: any;
  smartWalletProvisioned: boolean;
  smartWalletStatusNotifierKit: any;
  address: string;
}

interface NotifiersState {
  shop: {
    items: any;
    characters: any;
  };
}

interface UpdateStatus {
  type: "UPDATE_STATUS";
  payload: { [key: string]: boolean };
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

interface SetSmartWalletStatus {
  type: "SET_SMART_WALLET_STATUS";
  payload: boolean;
}

interface Reset {
  type: "RESET";
}

export type PursePetname = [string, string];

export type AgoricDispatch = React.Dispatch<AgoricStateActions>;

export type AgoricStateActions =
  | Reset
  | SetAgoric
  | SetKreadContract
  | SetApiSend
  | SetLoading
  | SetTokenInfo
  | SetAddOffer
  | SetWalletConnection
  | SetChainStorageWatcher
  | SetOffers
  | SetSmartWalletStatus
  | UpdateStatus;

export interface OfferProposal {
  give: any;
  want: any;
}
