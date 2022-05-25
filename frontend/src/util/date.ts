export const getDatefromEpoch = (epoch: number) => {
  const date = new Date(epoch);
  const day = date.getDay();
  const parsedDay = day.toString().length === 1 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const parsedMonth = month.toString().length === 1 ? `0${month}` : month;
  const year = date.getFullYear();
  const formatedDate = `${parsedDay}.${parsedMonth}.${year}`;
  return formatedDate;
};
