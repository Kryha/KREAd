import { Item } from "../interfaces";

export const isSelected = (elementList: Item[], elementId: string): boolean => {
  const elementFound = elementList.filter((element) => element.id === elementId);
  console.log(!!elementFound.length);
  return !!elementFound.length;
};
