import { uISTToIST } from "../../util";

export const error = {
  somethingWentWrong: "something went wrong...",
  pageNotFound: "page not found...",
  dataNotFound: "data not found...",
  couldNotFindEvent: "could not find event",
  sorrySomethingWentWrong:
    "sorry, something went wrong and the page you were looking for is not available right now! We are working hard to solve this problem!",
  goBack: "go back",
  goHome: "go home",
  downloadFailed: "an error occurred while downloading the character",
  mint: {
    invalidName: "Name is already taken",
    nameTaken: `Name taken`,
    title: "Mint failed",
    insufficientFunds: (ist: bigint) => `Insufficient funds (current balance: ${uISTToIST(Number(ist))} IST)`
  },
  youHaveNotEquipped: "Oops..you have not equipped your item!",
  categoryAlreadyEquipped: {
    title: (category?: string) => `Oops.. you already have a ${category} item equipped!`,
    info: (name?: string, category?: string) => `Unequip ${name} before equiping a new ${category}`
  },
} as const;
