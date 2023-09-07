import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { MenuText } from "../atoms";
import { ArrowContainer, Close, HeaderContainer, ReturnContainer } from "./styles";

interface FormHeaderCloseProps {
  title: string;
  link: string;
}

export const FormHeaderClose: FC<FormHeaderCloseProps> = ({ title, link }) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <MenuText>{title}</MenuText>
      <ReturnContainer>
        <ArrowContainer>
          <Close onClick={() => navigate(link)} />
        </ArrowContainer>
      </ReturnContainer>
    </HeaderContainer>
  );
};
