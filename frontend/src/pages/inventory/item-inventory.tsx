import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FadeInOut, LoadingPage } from "../../components";
import { PageContainer } from "../../components/page-container";
import { routes } from "../../navigation";
import { useMyItems } from "../../service";
import { text } from "../../assets/text";
import { ItemsList } from "../../containers/items-list";
import { ItemDetailSection } from "../../containers/detail-section";
import { EmptyItemInventory } from "./empty-item-inventory";
import { DetailWrapper } from "./styles";

export const ItemsInventory: FC = () => {
  const [{ owned, equipped }, isLoading] = useMyItems();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>("");

  const allItems = [...owned, ...equipped];

  const item = allItems?.find((item) => item.id === selectedId);

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

  const isEmpty = !allItems || !allItems.length;

  return isEmpty ? (
    <EmptyItemInventory />
  ) : (
    <PageContainer sidebarContent={<ItemsList onItemClick={setSelectedId} />}>
      <FadeInOut show={true} exiting={false}>
        <DetailWrapper>
          <ItemDetailSection
            item={item || allItems[0]}
            actions={{ primary: { text: text.item.equip, onClick: equip }, secondary: { text: text.item.sell, onClick: sell } }}
          />
        </DetailWrapper>
      </FadeInOut>
    </PageContainer>
  );
};
