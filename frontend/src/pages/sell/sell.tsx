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
import { PlaceInShop } from "./place-in-shop";
import { CharacterInformation } from "./character-information";
import { CONFIRMATION_STEP, WALLET_INTERACTION_STEP } from "../../constants";
import { CharacterEquip } from "../../interfaces";

interface Props {
  children: ReactNode;
  data: SellData;
  setData: (data: SellData) => void;
  text: SellText;
  // currentStep: SellStep;
  // price: number;

  sendOfferHandler: (data: SellData) => Promise<void>;
  // setCurrentStep: (step: SellStep) => void;
  // onSubmit: (price: number) => void;
  // setPrice: (price: number) => void;

  isLoading: boolean;
  isOfferAccepted: boolean;
}

export const Sell: FC<Props> = ({
  children,
  data,
  setData,
  text: pText,
  // currentStep,
  // setCurrentStep,
  sendOfferHandler,
  // price,
  // setPrice,
  // onSubmit,
  isLoading,
  isOfferAccepted,
}) => {
  const { width, height } = useViewport();
  // const [price, setPrice] = useState<SellData>({ price: 0 });
  const [currentStep, setCurrentStep] = useState<SellStep>(0);

  const setInformationData = async (price: Pick<SellData, "price">) => {
    setData((prevData: SellData) => ({ ...prevData, price }));
    // setCurrentStep(WALLET_INTERACTION_STEP);
    setCurrentStep(CONFIRMATION_STEP);
  };

  // const changeStep = async (step: SellStep): Promise<void> => {
  //   setCurrentStep(step);
  // };

  if (!data) return <ErrorView />;

  const perStepDisplay = (): React.ReactNode => {
    switch (currentStep) {
      default:
      case 0:
        return <CharacterInformation disabled={isLoading} setData={setInformationData} />;
      case 1:
        // return <h1>Place In Shop</h1>;
        // return (
        //   <PlaceInShop
        //     sendOfferHandler={sendOfferHandler}
        //     submit={changeStep}
        //     price={price}
        //     isOfferAccepted={isOfferAccepted}
        //     isLoading={isLoading}
        //   />
        // );
        return (
          <SellForm
            onSubmit={() => sendOfferHandler(price)}
            data={price}
            changeStep={setCurrentStep}
            isLoading={isLoading}
            isOfferAccepted={isOfferAccepted}
          />
        );
      case 2:
        // return <h1>Confirmation</h1>;
        return <Confirmation data={data} text={pText} />;
    }
  };

  return (
    <PageContainer
      sidebarContent={
        <FormCard height={height} width={width}>
          <FormHeader currentStep={currentStep} title={pText.sell} link={routes.character} />
          {perStepDisplay()}
        </FormCard>
      }
    >
      <DetailContainer>{children}</DetailContainer>
    </PageContainer>
  );
};

//   return (
//     <ContentWrapper width={width} height={height}>
//       <FormCard height={height} width={width}>
//         <FormHeaderClose title={pText.sell} link={routes.inventory} />
//         {/* <CardContainer>
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
