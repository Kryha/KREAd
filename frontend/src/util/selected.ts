import { Item } from "../interfaces";

export const isSelected = (elementList: Item[], elementId: string): boolean => {
  const elementFound = elementList.filter((element) => element.name === elementId);
  return !!elementFound.length;
};
