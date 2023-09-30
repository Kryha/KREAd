import { ButtonText, FormTable, FormTableRow, FormText, HorizontalDivider } from "../atoms";
import { text } from "../../assets";
import { FC } from "react";
import { PLATFORM_RATE, ROYALTY_RATE } from "../../constants";

interface SellDescriptionProps {
  price: number;
}
export const SellDescription: FC<SellDescriptionProps> = ({ price }) => {
  const listPrice = price + price * ROYALTY_RATE + price * PLATFORM_RATE;
  const royaltyFee = price * ROYALTY_RATE;
  const platformFee = price * PLATFORM_RATE;

  return (
    <div>
      <FormTableRow>
        <FormText>{text.store.sellDescription}</FormText>
      </FormTableRow>
      <br />
      <FormText>Your list price will be:</FormText>
      <FormTable>
        <FormTableRow>
          <FormText>price</FormText>
          <ButtonText>{price.toFixed(2)} </ButtonText>
        </FormTableRow>
        <FormTableRow>
          <FormText>royalty fee</FormText>
          <ButtonText>{royaltyFee.toFixed(2)} </ButtonText>
        </FormTableRow>
        <FormTableRow>
          <FormText>platform fee</FormText>
          <ButtonText>{platformFee.toFixed(2)} </ButtonText>
        </FormTableRow>
        <HorizontalDivider />
        <FormTableRow>
          <FormText>list price (IST)</FormText>
          <ButtonText>{listPrice.toFixed(2)}</ButtonText>
        </FormTableRow>
      </FormTable>
    </div>
  );
};
