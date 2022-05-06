import { FC } from "react";
import { FilteringMask } from "../../assets";
import { MenuItem } from "../../view";

export const Landing: FC = () => {
  return (
    <><h1>Landing</h1><MenuItem items={[
      {
        name: "fasce jamsdsd",
        id: "123313",
        image: FilteringMask,
        equipped: true,
        category: "mask",
        price: 12.673278,
        amount: 23,
      },
      {
        name: "fasce jamsdsd",
        id: "123313",
        image: FilteringMask,
        equipped: false,
        category: "mask",
        price: 12.673278,
        amount: 23,
      },
      {
        name: "fasce jamsdsd",
        id: "123313",
        image: FilteringMask,
        equipped: false,
        category: "mask",
        price: 12.673278,
        amount: 23,
      },
      {
        name: "fasce jamsdsd",
        id: "123313",
        image: FilteringMask,
        equipped: false,
        category: "mask",
        price: 12.673278,
        amount: 23,
      },
    ]} /></>
  );
};
