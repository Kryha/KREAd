import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { CardHeader } from "@mui/material";

import { text, UnnamedCreator } from "../../assets";
import { color, imageSize } from "../../design";
import { routes } from "../../navigation";
import {
  Badge,
  BodyText,
  BoldLabel,
  ButtonText,
  Heading,
  HorizontalDivider,
  Label,
  PrimaryButton,
  SecondaryButton
} from "../atoms";
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
  TitleContainer
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
        <CardHeader component={() => (
          <DetailHeader>
            <DetailContainer>
              <TitleContainer>
                <Heading>{character.name}</Heading>
                <SubTitleContainer>
                  <Badge>{character.type}</Badge>
                  <BoldLabel customColor={color.black}>{text.param.itemId(character.characterId)}</BoldLabel>
                </SubTitleContainer>
              </TitleContainer>
              <InfoContainer>
                <PrimaryButton><ButtonText>{text.general.choose}</ButtonText></PrimaryButton>
                <SecondaryButton><ButtonText>{text.general.sell}</ButtonText></SecondaryButton>
                <Divider />
                <ArrowContainer>
                  <Close onClick={() => onClick()} />
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
          </DetailContent>
        </Content>
        <CardActionsContainer>
          {/* TODO: link to store */}
          <PrimaryButton onClick={() => navigate(routes.root)}><ButtonText>{text.character.deleteCharacter}</ButtonText></PrimaryButton>
        </CardActionsContainer>
      </Detail>
    </DetailWrapper>
  );
};
