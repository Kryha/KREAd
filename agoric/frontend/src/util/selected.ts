import { Item } from "../interfaces";

export const isSelected = (elementList: Item[], elementId: string): boolean => {
  const elementFound = elementList.filter((element) => element.id === elementId);
  return !!elementFound.length;
};
