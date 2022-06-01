import { Dispatch, FC, SetStateAction } from "react";
import { MenuItem } from "../../components";
import { Item } from "../../interfaces";
import { SortableListWrap } from "./styles";

// import { useFilteredItems, useItems } from "../../service";

// TODO set proper type for SetSelectedElementId
interface SortableListProps {
  list: Item[];
  setElementId: Dispatch<SetStateAction<string>>;
}

// TODO: Add filter & sortyng Hooks and components

export const SortableList: FC<SortableListProps> = ({ list, setElementId }) => {
  // const [selectedCategory, setSelectedCategory] = useState<string>("");
  // const [selectedSorting, setSelectedSorting] = useState<string>("");

  // TODO: Use Filtered Items Hook
  // const { data: items, isLoading } = useFilteredItems(selectedCategory, selectedSorting, { min: 0, max: 10000 }, "");

  // const { data: items, isLoading } = useItems();

  // if (isLoading) return <LoadingPage />;

  // TODO: get an empty section view
  // if (!items) return <></>;

  // const handleCategoryChange = (selected: string) => {
  //   setSelectedCategory(selected);
  // };

  // const handleSortingChange = (selected: string) => {
  //   setSelectedSorting(selected);
  // };

  return (
    <SortableListWrap>
      {/* TODO: add filters nav header */}
      {list.map((item) => (
        <MenuItem item={item} key={item.id} onClick={() => setElementId(item.id)} />
      ))}
    </SortableListWrap>
  );
};
