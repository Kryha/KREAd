import React, { FC } from "react";

import { KadoContainer, KadoWrapper } from "./styles";
import { ButtonText, PrimaryButton } from "../atoms";
import { color } from "../../design";
import { useKadoWidget } from "../../context/filter-context";
import { text } from "../../assets";

interface KadoProps {
  show: boolean;
}

export const Kado: FC<KadoProps> = ({ show }) => {
  const { toggleWidget } = useKadoWidget();
  return show ? (
    <KadoWrapper>
      <KadoContainer>
        <PrimaryButton onClick={toggleWidget}>
          <ButtonText customColor={color.white}>{text.store.returnToStore}</ButtonText>
        </PrimaryButton>
        <iframe
          src={
            "https://app.kado.money/?network=AGORIC&onRevCurrency=IST&cryptoList=IST,BLD&networkList=AGORIC&productList=BUY&theme=light&apiKey=e754173b-f412-41d6-aed2-ccc2b1caf81a"
          }
          width={"400"}
          height={"600"}
        ></iframe>
      </KadoContainer>
    </KadoWrapper>
  ) : null;
};
