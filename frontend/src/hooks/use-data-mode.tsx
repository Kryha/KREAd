import React, { useMemo, useState } from 'react';
import { SwitchSelector } from '../components';

export enum DataMode {
  Default = 0,
  Mock = 1,
}

export const useDataMode = () => {
  const [selectDataMode, setSelectDataMode] = useState<DataMode>(DataMode.Mock);

  const dataModeSelector = useMemo(() => (
    <SwitchSelector
      buttonOneText={"Default"}
      buttonTwoText={"Mock"}
      setSelectedIndex={setSelectDataMode}
      selectedIndex={selectDataMode}
    />
  ), [selectDataMode]);

  // console.log("selectDataMode", selectDataMode);

  return {dataModeSelector, selectDataMode};
}
