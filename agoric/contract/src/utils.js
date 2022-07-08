export const sameType = (a, b) => {
  const objectA = Object(a) === a;
  const objectB = Object(b) === b;
  if (objectA && objectB)
    return Object.getPrototypeOf(a) === Object.getPrototypeOf(b);
  else if (!objectA && !objectB) return typeof a === typeof b;
  else return false;
};
