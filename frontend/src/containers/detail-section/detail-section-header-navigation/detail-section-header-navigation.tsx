import { FC } from "react";
import { DetailSectionHeaderNavigationWrap } from "./styles";
import { ButtonText, PriceInRun, PrimaryButton, SecondaryButton } from "../../../components";
import { text } from "../../../assets/text";
import { ButtonClose } from "../../../components/button-close";
import { color } from "../../../design";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../navigation";
import { Item } from "../../../interfaces";

interface HeaderNavigationProps {
  handleClose: () => void;
  item: Item;
}

// TODO: Pass ButtonClose callback as onClick prop
export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ handleClose, item }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <DetailSectionHeaderNavigationWrap>
      {/* TODO: add links */}
      {location.pathname === routes.shop ? (
        <>
          <PriceInRun price={item.price} />
          <PrimaryButton onClick={() => navigate(`${routes.buy}/${item.id}`)}>
            <ButtonText customColor={color.white}>{text.character.buy}</ButtonText>
          </PrimaryButton>
        </>
      ) : (
        <>
          <PrimaryButton>
            <ButtonText customColor={color.white}>{text.character.equip}</ButtonText>
          </PrimaryButton>
          <SecondaryButton>
            <ButtonText>{text.character.sell}</ButtonText>
          </SecondaryButton>
        </>
      )}
      <ButtonClose onClick={handleClose} />
    </DetailSectionHeaderNavigationWrap>
  );
};
