import { FC } from "react";

import { useViewport } from "../../hooks";

import { BaseCharacter, MenuCard, } from "../../view";
import { FakeCharcters } from "../landing/fake-characters";
import { Items } from "../landing/fake-item-data";
import { ItemWrapper } from "./styles";


export const Item: FC = () => {
  const { height } = useViewport();

  return (
    <ItemWrapper height={height}>
      <BaseCharacter character={FakeCharcters[0]} size="extraLarge" isZoomed />
      <MenuCard title={"mask"} items={Items.mask} amount={Items.mask.length} width={"150px"} height={"150px"} marginTop="-75px" marginLeft="-35px" />
    </ItemWrapper>
  );
};
