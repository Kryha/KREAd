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
    getLocalStorageData('dataMode', DataMode.Mock) // Retrieve the data mode from local storage or use the default value
  );
  const [mockData, setMockData] = useState<boolean>(
    getLocalStorageData('mockData', false) // Retrieve the mock data setting from local storage or use the default value
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
        Reload page to apply changes
      </SelectDataMode>

    ),
    [selectDataMode]
  );

  useEffect(() => {
    setLocalStorageData('dataMode', selectDataMode); // Store the selected data mode in local storage

    if (selectDataMode === DataMode.Mock) {
      setLocalStorageData('mockData', true); // Store the mock data setting in local storage
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
