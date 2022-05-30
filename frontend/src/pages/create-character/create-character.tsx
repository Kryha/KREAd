import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultIcon, text } from "../../assets";
import { MenuText } from "../../components";

import { PageContainer } from "../../components/page-container";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { ArrowContainer, Close, DefaultImage, Divider, FormCard, HeaderContainer } from "./styles";

export const CreateCharacter: FC = () => {
  const { width, height } = useViewport();
  const navigate = useNavigate();
  return (
    <PageContainer
      mainContent={
        <DefaultImage
          src={DefaultIcon}
          alt={text.character.defaultCharacter}
          hei={height}
          wid={width}
        />}
      sidebarContent={
        <FormCard>
          <HeaderContainer>
            <MenuText>{text.mint.mintNewCharacter}</MenuText>
            <Divider />
            <ArrowContainer>
              <Close onClick={() => navigate(routes.root)} />
            </ArrowContainer>
          </HeaderContainer>
        </FormCard>
      }
    />
  );
};
