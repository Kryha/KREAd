export const inter = (microInter: bigint) => microInter * 1000000n;
export const uISTToIST = (uist: number) => uist / 1000000;

export const ISTTouIST = (ist: number) => ist * 1000000;

export const findAverageValue = (values: number[]) => {
  return values.reduce((acc, x) => acc + x, 0) / values.length;
};

export const findMinimumValue = (values: number[]) => {
  return Math.min(...values);
};
