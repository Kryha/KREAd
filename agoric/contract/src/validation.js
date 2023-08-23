// ts-check
import { errors } from './errors.js';

/**
 *
 * @param {AmountKeywordRecord} want
 *
 * @param {NameIsUniqueFn} nameIsUnique
 * @returns {string | undefined}
 */
const mintCharacter = (want, nameIsUnique) => {
  const parsedWant = want.Asset.value.payload[0][0];

  if (!parsedWant) {
    return errors.noWantInOffer;
  }

  if (!parsedWant.name) {
    return errors.noNameArg;
  }

  if (Object.keys(parsedWant).length !== 1) {
    return errors.unkwonwnArgInMintOffer;
  }

  if (!nameIsUnique(parsedWant.name)) {
    return errors.nameTaken(parsedWant.name);
  }

  return undefined;
};

export const validation = {
  mintCharacter,
};
