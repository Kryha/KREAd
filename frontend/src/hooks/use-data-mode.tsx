import React, { useEffect, useState } from "react";

export enum DataMode {
  Default = 0,
  Mock = 1,
}

export const useDataMode = () => {
  const [isMockData, setIsMockData] = useState<DataMode>(getLocalStorageData("data-mode", DataMode.Mock));

  const toggleDataMode = () => {
    const newDataMode = isMockData === DataMode.Default ? DataMode.Mock : DataMode.Default;
    setLocalStorageData("data-mode", newDataMode);
    setIsMockData(newDataMode);
  };

  useEffect(() => {
    setLocalStorageData("data-mode", isMockData);
  }, [isMockData]);

  return { isMockData, toggleDataMode };
};

const getLocalStorageData = (key: string, defaultValue: any) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

const setLocalStorageData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
