import { FC } from "react";
import { text } from "../../assets";
import { Footer, FormText, MenuText, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { color } from "../../design";
import { ContentWrapper, GeneralInfo, InfoContainer, KreadContainer, Title } from "./styles";

export const PrivacyMobile: FC = () => {
  return (
    <>
      <KreadContainer>
        <KreadIcon />
      </KreadContainer>
      <ContentWrapper>
        <InfoContainer>
          <MenuText>{text.content.privacyAndTerms}</MenuText>
          <TitleText customColor={color.darkGrey}>{text.content.weAreCommittedTo}</TitleText>
          <GeneralInfo>
            <Title>{text.content.whatInformationDoWe}</Title>
            <FormText customColor={color.darkGrey}>{text.content.weCollectPersonal}</FormText>
          </GeneralInfo>
        </InfoContainer>
      </ContentWrapper>
      <Footer />
    </>
  );
};
