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

  if (!want.Asset.value[0]) {
    return errors.noWantInOffer;
  }

  if (!want.Asset.value[0].name) {
    return errors.noNameArg;
  }
  
  if (Object.keys(want.Asset.value[0]).length !== 1) {
    return errors.unkwonwnArgInMintOffer;
  }

  if (!nameIsUnique(want.Asset.value[0].name)) {
    return errors.nameTaken(want.Asset.value[0].name);
  }

  return undefined
};

export const validation = {
  mintCharacter
}