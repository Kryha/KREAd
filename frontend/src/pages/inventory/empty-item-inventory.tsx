import { FC } from "react";
import { text } from "../../assets";
import { FadeInOut, OverviewEmpty } from "../../components";
import { EmptyCard } from "../../components/empty-card";
import { PageContainer } from "../../components/page-container";
import { OverviewContainer } from "./styles";

export const EmptyDetail: FC = () => {
  return (
    <FadeInOut show exiting={false}>
      <OverviewContainer>
        <OverviewEmpty
          headingText={text.item.noItemEquipped}
          descriptionText={text.item.youDidNotEquip}
          buttonText={text.item.startEquipping}
          onButtonClick={undefined}
        />
      </OverviewContainer>
    </FadeInOut>
  );
};

export const EmptyItemInventory: FC = () => {
  return (
    <PageContainer sidebarContent={<EmptyCard title={text.item.noItemsInInventory} description={text.item.buyItemsFromStore} />}>
      <EmptyDetail />
    </PageContainer>
  );
};
