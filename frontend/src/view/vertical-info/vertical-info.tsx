import { FC } from "react";
import { text } from "../../assets";

import { color } from "../../design";
import { Code, Dash, Diagonal, DiagonalContainer, Id, InfoContainer } from "./styles";

interface VerticalInfoProps {
  code: string;
  id: string | undefined;
  isRight?: boolean;
}

export const VerticalInfo: FC<VerticalInfoProps> = ({ code, id, isRight = false }) => {
  return (
    <InfoContainer>
      {id ?
        <Id customColor={color.black} isRight={isRight}>{text.param.itemId(id)}</Id>
        :
        <DiagonalContainer>
          <Diagonal />
        </DiagonalContainer>
      }
      <Dash isRight={isRight} />
      <Code isRight={isRight}>{code}</Code>
    </InfoContainer>
  );
}
