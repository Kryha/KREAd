import { useMemo } from "react";
import { Item } from "../../../interfaces";
import { useUserState } from "../../../context/user";
import { useSelectedCharacter } from "../../../service";
import { useCharacterBuilder } from "../../../context/character-builder-context";


export const useGetItemSelectionForCharacter = () => {
  const [selectedCharacter] = useSelectedCharacter();
  const { items } = useUserState();
  const { selectedAssetCategory: category, selectedAsset } = useCharacterBuilder();

  const equipped = useMemo(() => {
    if(!selectedCharacter) return { all: [], inCategory: undefined };
    const equipped: Item[] = Object.values(selectedCharacter.equippedItems).filter(i=>!!i);
    const inCategory = equipped.find(item=>item.category===category);
    return {
      all: equipped,
      inCategory
    };
  }, [selectedCharacter]);

  const unequipped = useMemo(() => {
    if(!selectedCharacter) return { all: [], inCategory: [] };
    const unequipped: Item[] = items;
    const inCategory = items.filter(item=>item.category===category);
    return {
      all: unequipped,
      inCategory
    };
  }, [selectedCharacter, items]);

  const inCategory = useMemo(()=>{
    if(equipped.inCategory) return [equipped.inCategory, ...unequipped.inCategory];
    return unequipped.inCategory;
  },[equipped, unequipped]);

  const selected = useMemo(()=>{
    return inCategory.find((item) => item.name === selectedAsset );
  },[selectedAsset, items]);

    return { equipped, unequipped, inCategory, selected };
  };