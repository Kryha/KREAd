import { FC } from "react";
import { text } from "../../assets";
import { OverviewEmpty } from "../../components";
import { EmptyCard } from "../../components/empty-card";
import { PageContainer } from "../../components/page-container";
import { OverviewContainer } from "./styles";

export const EmptyItemInventory: FC = () => {
  return (
    <PageContainer sidebarContent={<EmptyCard title={text.item.noItemsInInventory} description={text.item.buyItemsFromStore} />}>
      <OverviewContainer>
        <OverviewEmpty
          headingText={text.item.noItemEquipped}
          descriptionText={text.item.youDidNotEquip}
          buttonText={text.item.startEquipping}
          onButtonClick={undefined}
        />
      </OverviewContainer>
    </PageContainer>
  );
};
