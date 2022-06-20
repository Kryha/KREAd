import { FC } from "react";
import { text } from "../../assets";
import { ONE_HUNDRED_PERCENT } from "../../constants";
import { DetailSectionProgress } from "../../containers/detail-section/detail-section-progress-bar/styles";
import { color } from "../../design";

import { Item } from "../../interfaces";
import { Badge, ButtonText, HorizontalDivider, MenuText } from "../atoms";
import { Footer, Header, ProgressContainer, StatsContainer, StatsWrapper, Title } from "./styles";

interface ItemStatsProps {
  item?: Item;
  position: "left" | "right";
  area: "top" | "middle" | "bottom";
}

export const ItemStats: FC<ItemStatsProps> = ({ item, position, area }) => {
  return (
    <>
      {item ? (
        <StatsWrapper position={position} area={area}>
          <Header>
            <Title>{item.name}</Title>
            <Footer>
              <Badge>
                <ButtonText customColor={color.darkGrey}>{item.category}</ButtonText>
              </Badge>
              <ButtonText>{text.param.itemId(item.id)}</ButtonText>
            </Footer>
          </Header>
          <StatsContainer>
            <HorizontalDivider />
            <ButtonText customColor={color.darkGrey}>{text.item.level}</ButtonText>
            <MenuText>{item.level}</MenuText>
            <ProgressContainer>
              <ButtonText>{text.item.effectiveness}</ButtonText>
              <DetailSectionProgress id={text.item.effectiveness} value={item.effectiveness || 0} max={ONE_HUNDRED_PERCENT}>
                {item.effectiveness}
              </DetailSectionProgress>
            </ProgressContainer>
            <ProgressContainer>
              <ButtonText>{text.item.layerComplexity}</ButtonText>
              <DetailSectionProgress id={text.item.layerComplexity} value={item.layerComplexity || 0} max={ONE_HUNDRED_PERCENT}>
                {text.item.layerComplexity}
              </DetailSectionProgress>
            </ProgressContainer>
          </StatsContainer>
        </StatsWrapper>
      ) : (
        <></>
      )}
    </>
  );
};
