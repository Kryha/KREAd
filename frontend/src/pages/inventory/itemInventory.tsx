import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingPage, OverviewEmpty } from "../../components";
import { EmptyCard } from "../../components/empty-card";
import { PageContainer } from "../../components/page-container";
import { routes } from "../../navigation";
import { useMyItems } from "../../service";
import { text } from "../../assets/text";
import { OverviewContainer } from "./styles";
import { ItemsList } from "../../containers/items-list";
import { ItemDetailSection } from "../../containers/detail-section";

export const ItemsInventory: FC = () => {
  const [items, isLoading] = useMyItems();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>("");

  const item = useMemo(() => items?.find((item) => item.id === selectedId), [items, selectedId]);

  // TODO: move to Item service
  const equip = () => {
    // TODO: implement item equip
    console.log("TODO: implement item equip");
  };
  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellItem}/${selectedId}`);
  };

  if (isLoading) return <LoadingPage />;

  // TODO: Implement error handling at servive level
  // if (isError) return <ErrorView />;

  const isEmpty = !items || !items.length;

  return isEmpty ? (
    <PageContainer sidebarContent={<EmptyCard title={text.item.noItemsInInventory} description={text.item.buyItemsFromStore} />}>
      <OverviewContainer>
        <OverviewEmpty
          headingText={text.item.noItemEquipped}
          descriptionText={text.item.youDidNotEquip}
          buttonText={text.item.startEquipping}
          onButtonClick={equip}
        />
      </OverviewContainer>
    </PageContainer>
  ) : (
    <PageContainer sidebarContent={<ItemsList onItemClick={setSelectedId} />}>
      <ItemDetailSection
        item={item || items[0]}
        actions={{ primary: { text: text.item.equip, onClick: equip }, secondary: { text: text.item.sell, onClick: sell } }}
      />
    </PageContainer>
  );
};
