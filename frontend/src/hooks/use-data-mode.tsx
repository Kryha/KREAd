import { useEffect, useMemo, useState } from 'react';
import { SwitchSelector } from '../components';
import styled from '@emotion/styled';
import { fontSize, margins } from '../design';

export enum DataMode {
  Default = 0,
  Mock = 1,
}

const getLocalStorageData = (key: string, defaultValue: any) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

const setLocalStorageData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useDataMode = () => {
  const [selectDataMode, setSelectDataMode] = useState<DataMode>(
    getLocalStorageData('dataMode', DataMode.Mock)
  );
  const [mockData, setMockData] = useState<boolean>(
    getLocalStorageData('mockData', false)
  );

  const dataModeSelector = useMemo(
    () => (
      <SelectDataMode>
        <SwitchSelector
          buttonOneText={'Default'}
          buttonTwoText={'Mock'}
          setSelectedIndex={setSelectDataMode}
          selectedIndex={selectDataMode}
        />
        Reload page to apply data mode change
      </SelectDataMode>

    ),
    [selectDataMode]
  );

  useEffect(() => {
    setLocalStorageData('dataMode', selectDataMode);

    if (selectDataMode === DataMode.Mock) {
      setLocalStorageData('mockData', true);
      setMockData(true);
    } else {
      setLocalStorageData('mockData', false);
      setMockData(false);
    }
  }, [selectDataMode]);

  console.log('selectDataMode', mockData);

  return { dataModeSelector, mockData };
};

const SelectDataMode = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: ${fontSize.tiny};
  align-items: center;
  gap: ${margins.mini};
`;
