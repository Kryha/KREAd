import { FC } from "react";
import { text } from "../../assets";

import { KadoContainer } from "./styles";

interface KadoProps {
  show: boolean;
}

export const Kado: FC<KadoProps> = ({ show }) => {
  return (
    <KadoContainer show={show}>
      <iframe
        src={
          "https://app.kado.money/?network=AGORIC&onRevCurrency=IST&cryptoList=IST,BLD&networkList=AGORIC&productList=BUY&theme=light&apiKey=e754173b-f412-41d6-aed2-ccc2b1caf81a"
        }
        width={"480"}
        height={"620"}
      ></iframe>
    </KadoContainer>
  );
};
