// TODO: Add the conditions for swapping items if the item is equipped to the character

import { FC } from "react";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { ItemButtonContainer, ItemInfo, ItemInfoItem } from "./style";
import { Item } from "../../../interfaces";
import { Badge, ButtonText, PrimaryButton, SecondaryButton } from "../../../components";
import { color } from "../../../design";
import { getRarityString } from "../../../service";
import { ButtonInfoWrap } from "../../../components/button-info/styles";
import { text } from "../../../assets";

interface ItemInfoProps {
  item: Item;
  equip: (event: React.MouseEvent<HTMLButtonElement>) => void;
  unequip: (event: React.MouseEvent<HTMLButtonElement>) => void;
  sell: () => void;
  validateActions: { unequip: boolean, equip: boolean, sell: boolean}
}
export const ItemCardInfo: FC<ItemInfoProps> = ({ item, sell, unequip, equip, validateActions }) => {
  const { setShowDetails } = useCharacterBuilder();

  return (
    <ItemInfo>
      <ButtonText customColor={color.black}>{item?.name}</ButtonText>
      <ItemInfoItem>Lvl: {item?.level}</ItemInfoItem>
      <ItemInfoItem>Origin: {item?.origin}</ItemInfoItem>
      <Badge>
        <ButtonText>{getRarityString(item?.rarity)}</ButtonText>
      </Badge>
      <ItemButtonContainer>
        <ButtonInfoWrap onClick={() => setShowDetails(true)}>
          <SecondaryButton>{text.general.info}</SecondaryButton>
        </ButtonInfoWrap>
      </ItemButtonContainer>
    </ItemInfo>
  );
};
