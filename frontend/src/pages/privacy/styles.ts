import styled from "@emotion/styled";
import { FormText, TitleText } from "../../components";

export const ContentWrapper = styled.div`
  padding: 40px;
  overflow-y: scroll;
  width: 100%;
`;
export const Title = styled(FormText)``;

export const InfoContainer = styled.div`
  margin-top: 40px;
  ${TitleText} {
    margin-top: 8px;
    margin-bottom: 28px;
  }
  ${Title} {
    margin-top: 8px;
  }
  ${FormText} {
    margin-top: 8px;
    margin-bottom: 28px;
  }
  width: 820px;
`;

export const GeneralInfo = styled.div`
  width: 640px;
`;
