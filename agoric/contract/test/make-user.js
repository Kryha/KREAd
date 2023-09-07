/**
 * @typedef {{
 * character: Purse
 * item: Purse
 * payment: Purse
 * }} Purses
 */

/**
 * Creates a user with its own purses and seats
 * includes methods for checking balances and
 * depositing/widthdrawing assets
 *
 * This ensures a user only has access to its own
 * purses and seats, which better resembles the
 * real flow
 *
 * @param {string} name
 * @param {Purses} purses
 * @returns {{
 *  name: string
 *  purses: Purses
 *  getItems: () => Item[]
 *  getCharacters: () => any[]
 *  getPaymentBalance: () => bigint
 *  depositItems: (items) => void
 *  depositCharacters: (characters) => void
 *  depositPayment: (payment) => void
 *  withdrawItems: (items) => Payment
 *  withdrawCharacters: (characters) => Payment
 *  withdrawPayment: (payment) => Payment
 *  getSeat: () => any
 *  setMarketSeat: (seat) => void
 * }}
 */
export const makeKreadUser = (name, purses) => {
  const seat = {
    market: undefined,
  };
  const getItems = () =>
    purses.item.getCurrentAmount().value.payload.map(([value, _]) => value);
  const getCharacters = () =>
    purses.character
      .getCurrentAmount()
      .value.payload.map(([value, _]) => value);
  const getPaymentBalance = () => purses.payment.getCurrentAmount().value;

  const depositItems = (items) => purses.item.deposit(items);
  const depositCharacters = (characters) =>
    purses.character.deposit(characters);
  const depositPayment = (payment) => purses.payment.deposit(payment);

  const withdrawItems = (items) => purses.item.withdraw(items);
  const withdrawCharacters = (characters) =>
    purses.character.withdraw(characters);
  const withdrawPayment = (payment) => purses.payment.withdraw(payment);

  return {
    name,
    purses,
    getItems,
    getCharacters,
    getPaymentBalance,
    depositItems,
    depositCharacters,
    depositPayment,
    withdrawItems,
    withdrawCharacters,
    withdrawPayment,
    getSeat: () => seat,
    setMarketSeat: (marketSeat) => (seat.market = marketSeat),
  };
};
