import styled from "@emotion/styled";
import { FormText, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { margins } from "../../design";

export const ContentWrapper = styled.div`
  padding: ${margins.big};
  overflow-y: scroll;
  width: 100%;
  height: 100vh;
`;
export const Title = styled(FormText)``;

export const InfoContainer = styled.div`
  margin-top: ${margins.big};
  ${TitleText} {
    margin-top: ${margins.mini};
    margin-bottom: 28px;
  }
  ${Title} {
    margin-top: ${margins.mini};
  }
  ${FormText} {
    margin-top: ${margins.mini};
    margin-bottom: 28px;
  }
  width: 820px;
`;

export const GeneralInfo = styled.div`
  width: 640px;
`;

export const FooterContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const KreadContainer = styled.div`
  ${KreadIcon} {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 40px;
    width: 100px;
    height: 24px;
  }
`;
