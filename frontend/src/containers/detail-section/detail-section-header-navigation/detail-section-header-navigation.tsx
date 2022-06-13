import { FC } from "react";

import { DetailSectionHeaderNavigationWrap } from "./styles";
import { ButtonText, PriceInRun, PrimaryButton, SecondaryButton } from "../../../components";
import { ButtonClose } from "../../../components/button-close";
import { color } from "../../../design";
import { useLocation, useNavigate } from "react-router-dom";

interface Actions {
  onClose?: () => void;
  primary?: {
    text: string;
    onClick: () => void;
  };
  secondary?: {
    text: string;
    onClick: () => void;
  };
}

interface HeaderNavigationProps {
  actions: Actions;
  price?: number;
}

export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ actions, price }) => {
  const { primary, secondary, onClose } = actions;
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <DetailSectionHeaderNavigationWrap>
      {!!price && <PriceInRun price={price} />}

      {!!primary && (
        <PrimaryButton onClick={() => primary.onClick()}>
          <ButtonText customColor={color.white}>{primary.text}</ButtonText>
        </PrimaryButton>
      )}

      {!!secondary && (
        <SecondaryButton onClick={() => secondary.onClick()}>
          <ButtonText>{secondary.text}</ButtonText>
        </SecondaryButton>
      )}

      {!!onClose && <ButtonClose onClick={() => onClose()} />}
    </DetailSectionHeaderNavigationWrap>
  );
};

// export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ handleClose, item }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   return (
//     <DetailSectionHeaderNavigationWrap>
//       {location.pathname === routes.shop ? (
//         <>
//           <PriceInRun price={item.price} />
//           <PrimaryButton onClick={() => navigate(`${routes.buy}/${item.id}`)}>
//             <ButtonText customColor={color.white}>{text.character.buy}</ButtonText>
//           </PrimaryButton>
//         </>
//       ) : (
//         <>
//           {/* TODO: add links */}
//           <PrimaryButton>
//             <ButtonText customColor={color.white}>{text.character.equip}</ButtonText>
//           </PrimaryButton>
//           <SecondaryButton onClick={() => navigate(`${routes.sell}/${item.id}`)}>
//             <ButtonText>{text.character.sell}</ButtonText>
//           </SecondaryButton>
//         </>
//       )}
//       <ButtonClose onClick={handleClose} />
//     </DetailSectionHeaderNavigationWrap>
//   );
// };
