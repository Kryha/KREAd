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
}
export const ItemCardInfo: FC<ItemInfoProps> = ({ item, sell, unequip, equip }) => {
  const { setShowDetails } = useCharacterBuilder();

  const handleEquip = () => {
    console.log("EEEE")
  }
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
        {item.equippedTo !== "" ? (
          <PrimaryButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => unequip(event)}>
            <ButtonText customColor={color.white}>unequip</ButtonText>
          </PrimaryButton>
        ) : (
          <>
            <PrimaryButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => equip(event)}>
              <ButtonText customColor={color.white}>equip</ButtonText>
            </PrimaryButton>
            <PrimaryButton onClick={sell}>
              <ButtonText customColor={color.white}>sell</ButtonText>
            </PrimaryButton>
          </>
        )}
      </ItemButtonContainer>
    </ItemInfo>
  );
};
