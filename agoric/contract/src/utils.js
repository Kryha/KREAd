export const sameType = (a, b) => {
  const objectA = Object(a) === a;
  const objectB = Object(b) === b;
  if (objectA && objectB)
    return Object.getPrototypeOf(a) === Object.getPrototypeOf(b);
  else if (!objectA && !objectB) return typeof a === typeof b;
  else return false;
};

/* eslint-disable no-bitwise, no-plusplus */
export const makeHashId = (str, seed = 42) => {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  const primeA = 2246822507;
  const primeB = 3266489909;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), primeA) ^ Math.imul(h2 ^ (h2 >>> 13), primeB);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), primeA) ^ Math.imul(h1 ^ (h1 >>> 13), primeB);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
