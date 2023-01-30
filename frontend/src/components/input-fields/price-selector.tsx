import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";

import { text } from "../../assets/text";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { BoldLabel, ButtonText, PrimaryButton, SecondaryButton } from "../atoms";
import {
  ButtonContainer,
  ColorBox,
  InputContainer,
  InputWrapper,
  MaxInput,
  MinInput,
  RangeContainer,
  SliderContainer,
  SliderRange,
  SliderTrack,
  TextLabel,
  ThumbLeft,
  ThumbRight,
} from "./styles";

interface PriceSelectorProps {
  handleChange: (min: number, max: number) => void;
  min: number;
  max: number;
}

export const PriceSelector: FC<PriceSelectorProps> = ({ handleChange, min, max }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const [leftRange, setLeftRange] = useState(min / max);
  const [widthRange, setWidthRange] = useState(0);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const { height } = useViewport();

  const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    setWidthRange(maxPercent - minPercent);
    setLeftRange(minPercent);
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    setWidthRange(maxPercent - minPercent);
  }, [maxVal, getPercent]);

  const setMaxValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minVal + 1);
    setMaxVal(value);
    maxValRef.current = value;
  };
  const setMinValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxVal - 1);
    setMinVal(value);
    minValRef.current = value;
  };

  return (
    <ColorBox height={height}>
      <RangeContainer>
        <InputWrapper>
          <InputContainer>
            <BoldLabel>{text.store.min}</BoldLabel>
            <TextLabel>
              <MinInput type="number" placeholder={`${minVal}`} onChange={setMinValue} />
            </TextLabel>
          </InputContainer>
          <InputContainer>
            <BoldLabel>{text.store.max}</BoldLabel>
            <TextLabel>
              <MaxInput type="number" placeholder={`${maxVal}`} onChange={setMaxValue} />
            </TextLabel>
          </InputContainer>
        </InputWrapper>
        <ThumbLeft type="range" min={min} max={max} value={minVal} onChange={setMinValue} />
        <ThumbRight type="range" min={min} max={max} value={maxVal} onChange={setMaxValue} />
        <SliderContainer>
          <SliderTrack />
          <SliderRange width={widthRange} left={leftRange} />
        </SliderContainer>
      </RangeContainer>
      <ButtonContainer>
        <SecondaryButton
          onClick={() => {
            setMinVal(min);
            minValRef.current = min;
            setMaxVal(max);
            maxValRef.current = max;
            handleChange(min, max);
          }}
        >
          <ButtonText>{text.filters.clearFilter}</ButtonText>
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            handleChange(minVal, maxVal);
          }}
        >
          <ButtonText customColor={color.white}>{text.filters.apply}</ButtonText>
        </PrimaryButton>
      </ButtonContainer>
    </ColorBox>
  );
};
