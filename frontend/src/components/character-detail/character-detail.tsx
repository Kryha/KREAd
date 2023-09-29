import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { text, UnnamedCreator } from "../../assets";
import { color, imageSize } from "../../design";
import { routes } from "../../navigation";
import { Badge, BodyText, BoldLabel, ButtonText, Heading, HorizontalDivider, Label, PrimaryButton, SecondaryButton } from "../atoms";
import { ItemCard } from "../item-card";
import { SectionTitle } from "../section-titile";
import {
  ArrowContainer,
  CardActionsContainer,
  Close,
  Content,
  Detail,
  DetailContainer,
  DetailContent,
  DetailHeader,
  DetailWrapper,
  Divider,
  InfoContainer,
  SignContainer,
  StoryContainer,
  SubTitleContainer,
  TitleContainer,
} from "./styles";
import { Character } from "../../interfaces";

interface EquippedItemCardProps {
  character: Character | undefined;
  onClick: () => void;
}

export const CharacterDetail: FC<EquippedItemCardProps> = ({ character, onClick }) => {
  const navigate = useNavigate();

  if (!character) return <></>;

  return (
    <DetailWrapper>
      <Detail>
        <>
          <DetailHeader>
            <DetailContainer>
              <TitleContainer>
                <Heading>{character.name}</Heading>
                <SubTitleContainer>
                  <Badge>{character.origin}</Badge>
                  <BoldLabel customColor={color.black}>{text.param.id(character.id)}</BoldLabel>
                </SubTitleContainer>
              </TitleContainer>
              <InfoContainer>
                <PrimaryButton>
                  <ButtonText customColor={color.white}>{text.general.choose}</ButtonText>
                </PrimaryButton>
                <SecondaryButton>
                  <ButtonText>{text.general.sell}</ButtonText>
                </SecondaryButton>
                <Divider />
                <ArrowContainer>
                  <Close onClick={() => onClick()} />
                </ArrowContainer>
              </InfoContainer>
            </DetailContainer>
          </DetailHeader>
        </>
        <Content>
          <DetailContent>
            <HorizontalDivider />
            <SectionTitle title={text.character.story} index={text.character.zeroOne} />
            <StoryContainer>
              <SignContainer>
                <Label>{text.character.creators}</Label>
                <ItemCard image={UnnamedCreator} width={imageSize.minute} height={imageSize.tiny} />
              </SignContainer>
              <BodyText>{text.util.correctDescriptionString(character.description)}</BodyText>
            </StoryContainer>
          </DetailContent>
        </Content>
        <CardActionsContainer>
          <PrimaryButton onClick={() => navigate(routes.shop)}>
            <ButtonText customColor={color.white}>{text.character.deleteCharacter}</ButtonText>
          </PrimaryButton>
        </CardActionsContainer>
      </Detail>
    </DetailWrapper>
  );
};
