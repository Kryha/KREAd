import { FC } from "react";
import { GeneralInfo, InfoContainer, Info, Line, NumberInfo, Text } from "./styles";

interface VerticalInfoProps {
  generalInfo: string;
  id: string;
}

export const VerticalInfo: FC<VerticalInfoProps> = ({ generalInfo, id }) => {
  return (
    <Info>
      <Text>
        <NumberInfo>{id}</NumberInfo>
      </Text>
      <Line />
      <InfoContainer>
        <GeneralInfo>{generalInfo}</GeneralInfo>
      </InfoContainer>
    </Info>
  );
}
