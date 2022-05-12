import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "@agoric/types";
import { CardHeader } from "@mui/material";


import { text, UnnamedCreator } from "../../assets";
import { GO_BACK } from "../../constants";
import { color, imageSize } from "../../design";
import { routes } from "../../navigation";
import {
  Badge,
  BodyText,
  BoldLabel,
  Heading,
  HorizontalDivider,
  Label,
  PrimaryButton,
  SecondaryButton
} from "../atoms";

import { ItemCard } from "../item-card";
import { SectionTitle } from "../section-titile";
import { ArrowContainer, CardActionsContainer, Close, Content, Detail, DetailContainer, DetailContent, DetailHeader, DetailWrapper, Divider, InfoContainer, SignContainer, StoryContainer, SubTitleContainer, TitleContainer } from "./styles";

interface EquippedItemCardProps {
  character: Character | undefined;
};

export const CharacterDetail: FC<EquippedItemCardProps> = ({ character }) => {
  const navigate = useNavigate();

  if (!character) return <></>;

  return (
    <DetailWrapper>
      <Detail>
        <CardHeader component={() => (
          <DetailHeader>
            <DetailContainer>
              <TitleContainer>
                <Heading>{character.name}</Heading>
                <SubTitleContainer>
                  <Badge>{character.category}</Badge>
                  <BoldLabel customColor={color.black}>{text.param.itemId(character.id)}</BoldLabel>
                </SubTitleContainer>
              </TitleContainer>
              <InfoContainer>
                <PrimaryButton>{text.general.choose}</PrimaryButton>
                <SecondaryButton>{text.general.sell}</SecondaryButton>
                <Divider />
                <ArrowContainer>
                  <Close onClick={() => navigate(GO_BACK)} />
                </ArrowContainer>
              </InfoContainer>
            </DetailContainer>
          </DetailHeader>
        )}
        />
        <Content>
          <DetailContent>
            <HorizontalDivider />
            <SectionTitle title={text.character.story} index={text.character.zeroOne} />
            <StoryContainer>
              <SignContainer>
                <Label>{text.character.creators}</Label>
                <ItemCard image={UnnamedCreator} width={imageSize.minute} height={imageSize.tiny} />
              </SignContainer>
              <BodyText>{character.description}</BodyText>
            </StoryContainer>
            <SectionTitle title={text.character.stats} index={text.character.zeroTwo} />
            <SectionTitle title={text.character.items} index={text.character.zeroThree} />
            <SectionTitle title={text.character.details} index={text.character.zeroFour} />
            <SectionTitle title={text.character.project} index={text.character.zeroFive} />
            <SectionTitle title={text.character.itemActivity} index={text.character.zeroSix} />
          </DetailContent>
        </Content>
        <CardActionsContainer>
          {/* TODO: link to store */}
          <PrimaryButton onClick={() => navigate(routes.root)}>{text.character.deleteCharacter}</PrimaryButton>
        </CardActionsContainer>
      </Detail>
    </DetailWrapper>
  );
};
