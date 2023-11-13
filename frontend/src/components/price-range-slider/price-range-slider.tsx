import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useViewport } from "../../hooks";
import {
  ButtonContainer,
  ColorBox,
  InputContainer,
  InputWrapper,
  MaxInput,
  MinInput,
  RangeContainer,
  TextLabel,
} from "../input-fields/styles";
import { BoldLabel, ButtonText, SecondaryButton } from "../atoms";
import { text } from "../../assets";
import { uISTToIST } from "../../util";
import { color } from "../../design";

interface Props {
  prices: number[];
  setPrice: (value: { min: number; max: number }) => void;
  reset: boolean;
}
export const PriceRangeSlider: FC<Props> = ({ prices, setPrice, reset }) => {
  const range = [uISTToIST(Math.min(...prices)), uISTToIST(Math.max(...prices))];
  const { height } = useViewport();
  const [domain] = useState(range);
  const [, setUpdate] = useState<readonly number[]>(range);
  const [inputValues, setInputValues] = useState<readonly number[]>(domain);

  const onUpdate = (update: readonly number[]) => {
    setUpdate(update);
    setInputValues(update);
  };

  const onValuesChange = (newValues: readonly number[]) => {
    const min = (newValues[0]);
    const max = (newValues[1]);
    setPrice({ min, max });
  };

  const onStartPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const newState = [value, inputValues[1]];
    onUpdate(newState);
    onValuesChange(newState);
  };

  const onMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const newState = [inputValues[0], value];
    onUpdate(newState);
    onValuesChange(newState);
  };

  const onReset = () => {
    setUpdate(domain);
    setInputValues(domain);
    setPrice({ min: domain[0], max: domain[1] });
  };

  useEffect(()=> onReset(), []);
  useEffect(()=>{
    if(reset) onReset();
  }, [reset]);

  return (
    <ColorBox height={height}>
      <RangeContainer>
        <InputWrapper>
          <InputContainer>
            <BoldLabel>{text.store.min}</BoldLabel>
            <TextLabel>
              <MinInput type="number" placeholder={`${uISTToIST(inputValues[0])}`} value={inputValues[0]} onChange={onStartPriceChange} />
            </TextLabel>
          </InputContainer>
          <InputContainer>
            <BoldLabel>{text.store.max}</BoldLabel>
            <TextLabel>
              <MaxInput type="number" placeholder={`${uISTToIST(inputValues[1])}`} value={inputValues[1]} onChange={onMaxPriceChange} />
            </TextLabel>
          </InputContainer>
        </InputWrapper>
        {/* Disaled until we decide how to handle large ranges, consider:
            1. only show slider when the range is lower than 200 IST, or whatever max range we deem functional
            2. increase the steps exponentially to fit larger ranges
         <SliderContainer>
          <Slider
            mode={2}
            step={10000}
            domain={domain}
            rootStyle={{
              display: "flex",
              position: "relative",
              alignItems: "center",
              width: "100%",
            }}
            onUpdate={onUpdate}
            onChange={onValuesChange}
            values={values}
          >
            <SliderTrack />
            <Handles>
              {({ handles, getHandleProps }) => (
                <div className="">
                  {handles.map((handle) => (
                    <Handle key={handle.id} handle={handle} domain={domain} getHandleProps={getHandleProps} />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks left={false} right={false}>
              {({ tracks, getTrackProps }) => (
                <div className="">
                  {tracks.map(({ id, source, target }) => (
                    <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
                  ))}
                </div>
              )}
            </Tracks>
          </Slider>
        </SliderContainer> */}
      </RangeContainer>
      <ButtonContainer>
        <SecondaryButton onClick={onReset}>
          <ButtonText>{text.filters.clearFilter}</ButtonText>
        </SecondaryButton>
      </ButtonContainer>
    </ColorBox>
  );
};

interface HandleProps {
  handle: {
    id: string;
    value: number;
    percent: number;
  };
  domain: number[];
  getHandleProps: (id: string) => any;
}
export const Handle: FC<HandleProps> = ({ handle: { id, value, percent }, domain, getHandleProps }) => {
  return (
    <div
      aria-valuemin={domain[0]}
      aria-valuemax={domain[1]}
      aria-valuenow={value}
      style={{
        top: -5,
        left: `${percent}%`,
        position: "absolute",
        zIndex: 2,
        width: 10,
        height: 10,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: color.black,
      }}
      {...getHandleProps(id)}
    ></div>
  );
};

interface TrackProps {
  source: any;
  target: any;
  getTrackProps: any;
}
export const Track: FC<TrackProps> = ({ source, target, getTrackProps }) => {
  return (
    <div
      style={{
        position: "absolute",
        height: 4,
        marginTop: -2,
        zIndex: 1,
        backgroundColor: color.black,
        borderRadius: 3,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
};
