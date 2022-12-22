export interface AgoricService {
  zoe: any;
  board: any;
  zoeInvitationDepositFacetId: any;
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
  purses: Purses;
  contracts: Contracts;
  agoric: AgoricService;
  notifiers: NotifiersState;
  offers: any[];

  isLoading: boolean;
}

interface NotifiersState {
  shop: {
      items: any,
      characters: any,
    }
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

interface SetTokenPurses {
  type: "SET_TOKEN_PURSES";
  payload: any[];
}

interface SetMoneyPurses {
  type: "SET_MONEY_PURSES";
  payload: any[];
}

interface SetOffers {
  type: "SET_OFFERS";
  payload: any[];
}

interface SetCharacterPurses {
  type: "SET_CHARACTER_PURSES";
  payload: any[];
}

interface SetItemPurses {
  type: "SET_ITEM_PURSES";
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

interface SetNotifiers {
  type: "SET_NOTIFIERS";
  payload: Partial<NotifiersState>;
}

interface SetApiSend {
  type: "SET_APISEND";
  payload: any;
}

interface SetLoading {
  type: "SET_LOADING";
  payload: boolean;
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
  | SetTokenPurses
  | SetCharacterPurses
  | SetMoneyPurses
  | SetAgoric
  | SetCharacterContract
  | SetItemPurses
  | SetNotifiers
  | SetApiSend
  | SetLoading
  | SetOffers;
