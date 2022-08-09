import { FC } from "react";

import { Id, InfoContainer } from "./styles";

interface VerticalInfoProps {
  code: string;
  isRight?: boolean;
}

export const VerticalInfo: FC<VerticalInfoProps> = ({
  code,
  isRight = false,
}) => {
  return (
    <InfoContainer>
      <Id isRight={isRight} category={code}>
        {code}
      </Id>
    </InfoContainer>
  );
};
