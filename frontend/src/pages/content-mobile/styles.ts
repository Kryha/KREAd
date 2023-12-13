import styled from "@emotion/styled";
import { FormText, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { margins } from "../../design";

export const ContentWrapper = styled.div`
  padding: 10px;
  overflow-y: scroll;
  width: 100vw;
`;
export const Title = styled(FormText)``;

export const InfoContainer = styled.div`
  padding-left: 20px;
  padding-top: 4%;
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
  width: 100%;
`;

export const GeneralInfo = styled.div`
  width: 100%;
`;

export const KreadContainer = styled.div`
display: flex;
flex: 1;
justify-content: center;
margin-top: 30px;
${KreadIcon} {
  width: 100px;
  height: 24px;
}
`;
