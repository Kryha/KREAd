import { useEffect, useState } from "react";
import { DEFAULT_NETWORK_CONFIG } from "../constants";

const NETWORK_CONFIG = "NETWORK_CONFIG";

export const useNetworkConfig = () => {
  // Initialize the network state with the value from localStorage or the default value
  const [network, setNetwork] = useState<string>(() => {
    const storedNetwork = localStorage.getItem(NETWORK_CONFIG);
    return storedNetwork || DEFAULT_NETWORK_CONFIG;
  });

  // Update localStorage when the network state changes
  useEffect(() => {
    localStorage.setItem(NETWORK_CONFIG, network);
  }, [network]);

  const setNetworkValue = (value: string) => {
    setNetwork(value);
    window.location.reload();
  };

  return { network, setNetworkValue };
};
