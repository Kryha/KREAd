import { FC, ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import { text } from "../../assets";
import {
  ButtonText,
  Data,
  ErrorView,
  FormHeader,
  FormHeaderClose,
  FormText,
  Input,
  Label,
  LoadingPage,
  MenuItem,
  PrimaryButton,
} from "../../components";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { FormCard } from "../create-character/styles";
import {
  ArrowUp,
  ButtonContainer,
  CardContainer,
  ContentWrapper,
  DetailContainer,
  ErrorContainer,
  FormFields,
  InputContainer,
  InputWrapper,
  TextLabel,
  Tick,
  Warning,
} from "./styles";
import { color } from "../../design";
import { ButtonInfo } from "../../components/button-info";
import { SellText, SellData, SellStep } from "./types";
import { SellForm } from "./sell-form";
import { Confirmation } from "./confirmation";
import { PageContainer } from "../../components/page-container";
import { PutForSale } from "./put-for-sale";
import { CharacterInformation } from "./character-information";

interface Props {
  children: ReactNode;
  data: SellData;
  text: SellText;

  onSubmit: (price: number) => void;

  isLoading: boolean;
  isOfferAccepted: boolean;
}

export const Sell: FC<Props> = ({ children, data, text: pText, onSubmit, isLoading, isOfferAccepted }) => {
  const { width, height } = useViewport();
  const [currentStep, setCurrentStep] = useState<SellStep>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<{ price: number }>({ mode: "onChange", reValidateMode: "onChange" });

  if (!data) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      default:
      case 0:
        // return <h1>Information</h1>;
        return <CharacterInformation disabled={isLoading} />;
      case 1:
        return <h1>PutForSale</h1>;
      // return <PutForSale sendOfferHandler={sendOfferHandler} submit={changeStep} isOfferAccepted={isOfferAccepted} isLoading={isLoading} />;
      case 2:
        return <h1>Confirmation</h1>;
      // return <Confirmation character={mintedCharacter?.nft} />;
    }
  };

  return (
    <ContentWrapper>
      <PageContainer sidebarContent={children}>
        <FormCard height={height} width={width}>
          <FormHeader currentStep={currentStep} title={pText.sell} link={routes.shop} />
          {perStepDisplay()}
        </FormCard>
      </PageContainer>
    </ContentWrapper>
  );
};

//   return (
//     <ContentWrapper width={width} height={height}>
//       <FormCard height={height} width={width}>
//         <FormHeaderClose title={pText.sell} link={routes.inventory} />
//         {/* <CardContainer>
//           <h1>test</h1>
//           <MenuItem data={data} />
//         </CardContainer> */}
//         <form onSubmit={handleSubmit((data) => onSubmit(data.price))}>
//           <FormFields>
//             <InputContainer>
//               <Label>{text.store.setPrice}</Label>
//               <TextLabel>
//                 {/*TODO: remove support for e notation, or handle conversion to bigint */}
//                 <Input type="number" defaultValue="" {...register("price", { required: true, min: 1 })} />
//               </TextLabel>
//             </InputContainer>
//             <InputWrapper>
//               {Boolean(!errors.price && dirtyFields.price) && <Tick />}
//               <ButtonInfo info={text.general.sellAssetInfo} />
//             </InputWrapper>
//             {Boolean(errors.price && errors.price.type === "required") && (
//               <ErrorContainer>
//                 <Warning />
//                 <ButtonText>{text.general.thisFieldIsRequired}</ButtonText>
//               </ErrorContainer>
//             )}
//             {Boolean(errors.price && errors.price.type === "min") && (
//               <ErrorContainer>
//                 <Warning />
//                 <ButtonText>{text.general.theMinimiumAmountIs}</ButtonText>
//               </ErrorContainer>
//             )}
//           </FormFields>
//           <FormText>{text.store.sellDescription}</FormText>
//           <ButtonContainer>
//             <PrimaryButton type="submit" disabled={!isValid || isLoading}>
//               <ButtonText customColor={color.white}>{text.store.placeInShop}</ButtonText>
//               {isLoading ? <LoadingPage /> : <ArrowUp />}
//             </PrimaryButton>
//           </ButtonContainer>
//         </form>
//       </FormCard>
//       <DetailContainer>{children}</DetailContainer>
//     </ContentWrapper>
//   );
// };
