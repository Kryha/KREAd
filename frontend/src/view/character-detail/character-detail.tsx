import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "@agoric/types";
import { CardHeader } from "@mui/material";


import { text, UnnamedCreator } from "../../assets";
import { GO_BACK } from "../../constants";
import { color } from "../../design";
import { routes } from "../../navigation";
import { Badge, BodyText, BoldLabel, Heading, HorizontalDivider, Label, PrimaryButton, SecondaryButton } from "../atoms";

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
                  <Badge>{"Tempt scavenger"}</Badge>
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
            <SectionTitle title={"Story"} index={"01"} />
            <StoryContainer>
              <SignContainer>
                <Label>{"creators"}</Label>
                <ItemCard image={UnnamedCreator} width={"26.95px"} height={"60px"} />
              </SignContainer>
              <BodyText>{"A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology."}</BodyText>
            </StoryContainer>
            <SectionTitle title={"Stats"} index={"02"} />
            <SectionTitle title={"Items"} index={"03"} />
            <SectionTitle title={"Details"} index={"04"} />
            <SectionTitle title={"Project"} index={"05"} />
            <SectionTitle title={"Item Activity"} index={"06"} />
          </DetailContent>
        </Content>
        <CardActionsContainer>
          {/* TODO: link to store */}
          <PrimaryButton type="submit" onClick={() => navigate(routes.root)}>{"Delete character"}</PrimaryButton>
        </CardActionsContainer>
      </Detail>
    </DetailWrapper>
  );
};
