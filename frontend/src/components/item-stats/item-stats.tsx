import { FC } from "react";
import { text } from "../../assets";
import { ONE_HUNDRED_PERCENT } from "../../constants";
import { DetailSectionProgress } from "../../containers/detail-section/detail-section-progress-bar/styles";
import { color } from "../../design";

import { isItemCategory, Item } from "../../interfaces";
import { Badge, ButtonText, HorizontalDivider, MenuText } from "../atoms";
import { Footer, Header, LevelContainer, ProgressContainer, StatsContainer, StatsWrapper, Title } from "./styles";

interface ItemStatsProps {
  item?: Item;
  position: "left" | "right";
  area: "top" | "middle" | "bottom";
}

export const ItemStats: FC<ItemStatsProps> = ({ item, position, area }) => {
  if (!item || !isItemCategory(item.category)) return <></>;

  return (
    <StatsWrapper position={position} area={area}>
      <Header>
        <Title>{item.name}</Title>
        <Footer>
          <Badge>
            <ButtonText customColor={color.darkGrey}>{text.param.categories[item.category]}</ButtonText>
          </Badge>
          <ButtonText>{text.param.id(item.name)}</ButtonText>
        </Footer>
      </Header>
      <StatsContainer>
        <HorizontalDivider />
        <LevelContainer>
          <ButtonText customColor={color.darkGrey}>{text.item.level}</ButtonText>
          <MenuText>{item.level}</MenuText>
        </LevelContainer>
        <ProgressContainer>
          <ButtonText>{text.item.effectiveness}</ButtonText>
          {/* FIXME: wrong property */}
          {/* <DetailSectionProgress id={text.item.effectiveness} value={item.effectiveness || 0} max={ONE_HUNDRED_PERCENT}>
            {item.effectiveness}
          </DetailSectionProgress> */}
        </ProgressContainer>
        <ProgressContainer>
          <ButtonText>{text.item.layerComplexity}</ButtonText>
          {/* FIXME: wrong property */}
          {/* <DetailSectionProgress id={text.item.layerComplexity} value={item.layerComplexity || 0} max={ONE_HUNDRED_PERCENT}>
            {text.item.layerComplexity}
          </DetailSectionProgress> */}
        </ProgressContainer>
      </StatsContainer>
    </StatsWrapper>
  );
};
