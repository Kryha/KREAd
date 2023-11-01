import { E } from '@endo/eventual-send';

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
 * @returns {KreadUser} 
 */
export const makeKreadUser = (name, purses) => {
  const seat = {
    market: undefined,
  };
  const getItems = async () =>
    (await E(purses.item).getCurrentAmount()).value.payload.map(
      ([value, _]) => value,
    );
  const getCharacters = async () =>
    (await E(purses.character).getCurrentAmount()).value.payload.map(
      ([value, _]) => value,
    );
  const getPaymentBalance = async () =>
    (await E(purses.payment).getCurrentAmount()).value;

  const depositItems = async (items) => E(purses.item).deposit(items);
  const depositCharacters = async (characters) =>
    E(purses.character).deposit(characters);
  const depositPayment = async (payment) => E(purses.payment).deposit(payment);

  const withdrawItems = async (items) => E(purses.item).withdraw(items);
  const withdrawCharacters = async (characters) =>
    E(purses.character).withdraw(characters);
  const withdrawPayment = async (payment) =>
    E(purses.payment).withdraw(payment);

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
