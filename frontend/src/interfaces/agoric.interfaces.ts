import { inter } from "../util";

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
  publicFacet: any;
  instanceBoardId?: string;
}

interface Contracts {
  characterBuilder: Contract;
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
  walletConnection: {
    pursesNotifier: any,
    addOffer: any,
    publicSubscribersNotifier: any,
    leader: any,
    address: any,
    chainId: string,
    unserializer: any,
  },  
  notifiers: NotifiersState;
  offers: any[];
  tokenInfo: TokenInfo & { boardIds: TokenInfo };
  isLoading: boolean;
  isReady: boolean;
}

export interface TokenInfo {
  character: { issuer: any, brand: any },
  item: { issuer: any, brand: any },
  paymentFT: { issuer: any, brand: any },
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

interface SetCharacterContract {
  type: "SET_CHARACTER_CONTRACT";
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
  payload: TokenInfo & { boardIds: TokenInfo };
}

interface SetAddOffer {
  type: "SET_ADD_OFFER";
  payload: any;
}

interface SetWalletConnection {
  type: "SET_WALLET_CONNECTION";
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
  | SetCharacterContract
  | SetApiSend
  | SetLoading
  | SetTokenInfo
  | SetAddOffer
  | SetWalletConnection
  | SetOffers;
