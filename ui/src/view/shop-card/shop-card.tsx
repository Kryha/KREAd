import { FC } from "react";

import {
  Product,
  Image1,
  CharacterMasks,
  Content,
  Image,
  Footer,
  Tag,
  Masks,
  RUN001,
  TitleText,
  TitleWrapper,
  TitleContainer,
  OwnerText,
  OwnedByContainer,
  MediumText
} from "./styles";

interface ShopCardProps {
  image: string;
  title: string;
  owner: string;
  category: string;
  version: string;
}

export const ShopCard: FC<ShopCardProps> = ({ image, title, owner, category, version }) => {
  return (
    <Product>
      <Image>
        <Image1>
          <CharacterMasks src={image} />
        </Image1>
      </Image>
      <Content>
        <TitleWrapper>
          <TitleContainer>
            <TitleText>{title}</TitleText>
          </TitleContainer>
          <OwnedByContainer>
            <OwnerText>{owner}</OwnerText>
          </OwnedByContainer>
        </TitleWrapper>
        <Footer>
          <Tag>
            <Masks>
              <MediumText>{category}</MediumText>
            </Masks>
          </Tag>
          <RUN001>
            <MediumText>{version}</MediumText>
          </RUN001>
        </Footer>
      </Content>
    </Product>
  );
}
