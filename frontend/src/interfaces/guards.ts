export const isString = (variable: unknown): variable is string => {
  return typeof variable === "string";
};
