import { FC } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import { text } from "../../assets";
import { ButtonText, ErrorView, FormHeaderClose, FormText, Input, Label, LoadingPage, PrimaryButton } from "../../components";
import { PageContainer } from "../../components/page-container";
import { ItemDetailSection } from "../../containers/detail-section";
import { useViewport } from "../../hooks";
import { routes } from "../../navigation";
import { useItem, useSellItem } from "../../service";
import { FormCard } from "../create-character/styles";
import { ArrowUp, ButtonContainer, ContentWrapper, Exclamation, FormFields, InputContainer, InputWrapper, TextLabel, Tick } from "./styles";
import { color } from "../../design";
import { ButtonInfo } from "../../components/button-info";

// TODO: rename to ItemSell
export const Sell: FC = () => {
  const { id } = useParams<"id">();
  const { width, height } = useViewport();
  const itemId = String(id);
  const { data: item, isLoading: isLoadingItem, isError: isErrorItem } = useItem(itemId);
  const sellItem = useSellItem();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<{ price: number }>({ mode: "onChange", reValidateMode: "onChange" });

  const submitForm = (price: { price: number }) => {
    sellItem.mutate({ price: price.price });
  };

  if (sellItem.isError) return <ErrorView />;
  if (sellItem.isSuccess) return <Navigate to={routes.shop} />;

  const onSubmit: SubmitHandler<{ price: number }> = (data) => submitForm(data);

  if (isLoadingItem) return <LoadingPage />;

  if (!item || isErrorItem) return <ErrorView />;

  return (
    <ContentWrapper>
      <PageContainer
        sidebarContent={
          <FormCard height={height} width={width}>
            <FormHeaderClose title={text.store.sellItem} link={routes.root} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormFields>
                <InputContainer>
                  <Label>{text.store.setPrice}</Label>
                  <TextLabel>
                    <Input type="number" defaultValue="" {...register("price", { required: true, min: 1 })} />
                  </TextLabel>
                </InputContainer>
                <InputWrapper>
                  {Boolean(errors.price) && <Exclamation />}
                  {Boolean(!errors.price && dirtyFields.price) && <Tick />}
                  <ButtonInfo title={text.general.toolTipTitle} info={text.general.toolTipInfo} />
                </InputWrapper>
                {Boolean(errors.price && errors.price.type === "required") && (
                  <ButtonText customColor={color.darkGrey}>{text.general.thisFieldIsRequired}</ButtonText>
                )}
                {Boolean(errors.price && errors.price.type === "min") && (
                  <ButtonText customColor={color.darkGrey}>{text.general.theMinimiumAmountIs}</ButtonText>
                )}
              </FormFields>
              <FormText>{text.store.sellDescription}</FormText>
              <ButtonContainer>
                <PrimaryButton type="submit" disabled={!isValid}>
                  <ButtonText customColor={color.white}>{text.store.placeInShop}</ButtonText>
                  <ArrowUp />
                </PrimaryButton>
              </ButtonContainer>
            </form>
          </FormCard>
        }
      >
        <ItemDetailSection item={item} />
      </PageContainer>
    </ContentWrapper>
  );
};
