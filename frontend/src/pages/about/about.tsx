import { FC } from "react";
import { text } from "../../assets";
import { FormText, MenuItemName, MenuText, TitleText } from "../../components";
import { color } from "../../design";
import { ContentWrapper, GeneralInfo, InfoContainer, Title } from "./styles";

export const About: FC = () => {
  return (
    <ContentWrapper>
      <MenuItemName>{text.general.logo}</MenuItemName>
      <InfoContainer>
        <MenuText>{text.content.about}</MenuText>
        <TitleText customColor={color.darkGrey}>{text.content.weAreCommittedTo}</TitleText>
        <GeneralInfo>
          <Title>{text.content.whatInformationDoWe}</Title>
          <FormText customColor={color.darkGrey}>{text.content.weCollectPersonal}</FormText>
          <Title>{text.content.whatInformationDoWe}</Title>
          <FormText customColor={color.darkGrey}>{text.content.weUseTheInformation}</FormText>
        </GeneralInfo>
      </InfoContainer>
    </ContentWrapper>
  );
};
