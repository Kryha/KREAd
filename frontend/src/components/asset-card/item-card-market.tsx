import { ItemInMarket } from "../../interfaces";
import { BoldLabel, Dash, ImageProps } from "../atoms";
import { FC } from "react";
import {
  AssetContent,
  AssetFooter,
  AssetImage,
  AssetImageContainer,
  AssetInfoContainer,
  AssetTag,
  AssetTitleText,
  AssetTitleWrapper,
  AssetWrapper,
} from "./styles";
import { text } from "../../assets";
import { color } from "../../design";

interface Props {
  itemInMarket: ItemInMarket;
  imageProps?: ImageProps;
  selectItemInMarketId: (id: string) => void;
}
export const ItemCardMarket: FC<Props> = ({ itemInMarket, selectItemInMarketId }) => {
  const { item } = itemInMarket;

  return (
    <AssetWrapper onClick={() => selectItemInMarketId(itemInMarket.id)}>
      <AssetContent>
        <AssetImageContainer>
          <AssetImage src={itemInMarket.item.image} category={itemInMarket.item.category} />
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{item.name}</AssetTitleText>
            <BoldLabel>{item.category}</BoldLabel>
          </AssetTitleWrapper>
          <AssetFooter>
            <AssetTag>
              <BoldLabel customColor={color.black}>{text.param.level(item.level)}</BoldLabel>
              {item.rarity && (
                <>
                  <Dash />
                  <BoldLabel customColor={color.black}>{text.param.rarity(item.rarity)}</BoldLabel>
                </>
              )}
            </AssetTag>
            {item.equippedTo && <BoldLabel customColor={color.black}>{text.general.equipped}</BoldLabel>}
            {item.forSale && <BoldLabel customColor={color.black}>{text.general.forSale}</BoldLabel>}
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};
