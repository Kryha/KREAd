import styled from "@emotion/styled";
import { PrimaryButton } from "../../../components";
import { color } from "../../../design";
import { ISTButtonIcon } from "../../../components/asset-card/styles";

export const CharacterActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  ${PrimaryButton} {
    :hover {
      ${ISTButtonIcon} {
        stroke: ${color.black};
        fill: ${color.black};
      }
    }
  }
`;
