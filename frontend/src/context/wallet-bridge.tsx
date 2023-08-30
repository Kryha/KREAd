/* TODO: SMART-WALLET SUPPPRT

Request dapp approval to smart-wallet
Should store addOffer method in Agoric context
Should handle wallet responses appropriately

Code below is taken from dapp-inter's implementation
(https://github.com/Agoric/dapp-inter/blob/main/src/components/OfferSignerBridge.tsx)
*/

import React, { useState } from "react";
import { BridgeProtocol } from "@agoric/web-components";
import { makeReactDappWalletBridge } from "@agoric/web-components/react";
import { bridgeHref, walletUiHref } from "../constants";
import { useAgoricContext } from "./agoric";

type BridgeReadyMessage = {
  detail: {
    data: {
      type: string;
    };
    isDappApproved: boolean;
    requestDappConnection: (petname: string) => void;
    addOffer: (offer: any) => void;
  };
};

type BridgeMessage = {
  detail: {
    data: {
      type: string;
      isDappApproved: boolean;
    };
  };
};

type BridgeError = {
  detail: {
    type: string;
    e: Error;
  };
};

// Create a wrapper for dapp-wallet-bridge that is specific to
// the app's instance of React.
const DappWalletBridge = makeReactDappWalletBridge(React);

const WalletBridge = () => {
  // const agoricDispatch = useAgoricStateDispatch();
  const [agoricState, agoricDispatch] = useAgoricContext();
  const [bridgeApproved, setBridgeApproved] = useState(false);

  const walletUIRef = walletUiHref();

  const showWarning = () => {
  };

  const showConnectionSuccessful = () => {
    console.log("connection successful");
  };

  const onBridgeReady = (ev: BridgeReadyMessage) => {
    const {
      detail: { isDappApproved, requestDappConnection, addOffer },
    } = ev;
    if (!isDappApproved) {
      console.log("need dapp approval: requesting connection...");
      requestDappConnection("kread");
    } else {
      setBridgeApproved(true);
      showConnectionSuccessful();
    }
    agoricDispatch({ type: "SET_ADD_OFFER", payload: addOffer });
  };

  const onError = (ev: BridgeError) => {
    console.log(ev);
    const message = ev.detail.e.message;
    console.log("error", message);
  };

  const onBridgeMessage = (ev: BridgeMessage) => {
    const data = ev.detail.data;
    const type = data.type;
    switch (type) {
      case BridgeProtocol.dappApprovalChanged:
        setBridgeApproved(data.isDappApproved);
        if (data.isDappApproved) {
          showConnectionSuccessful();
        } else {
          showWarning();
        }
        break;
      default:
        console.warn("Unhandled bridge message", data);
    }
  };

  if (!agoricState.walletConnection.address || !agoricState.walletConnection.chainId) return <></>;

  return (
    <div className="hidden">
      <DappWalletBridge
        bridgeHref={bridgeHref}
        onBridgeMessage={onBridgeMessage}
        onBridgeReady={onBridgeReady}
        onError={onError}
        address={agoricState.walletConnection.address}
        chainId={agoricState.walletConnection.chainId}
      />
    </div>
  );
};

export default WalletBridge;
