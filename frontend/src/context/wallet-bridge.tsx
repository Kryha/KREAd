import React, { useRef, useState } from "react";
import { BridgeProtocol } from "@agoric/web-components";
import { makeReactDappWalletBridge } from "@agoric/web-components/react";
import { prodBridgeHref, walletUiHref } from "../constants";
import { useAgoricStateDispatch } from "./agoric";

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
  const agoricDispatch = useAgoricStateDispatch();
  const [bridgeApproved, setBridgeApproved] = useState(false);
  const bridgeHref = prodBridgeHref;
  const walletUIRef = walletUiHref();

  const showWarning = () => {
    console.log("warning");
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

  return (
    <div className="hidden">
      <DappWalletBridge
        bridgeHref={bridgeHref}
        onBridgeMessage={onBridgeMessage}
        onBridgeReady={onBridgeReady}
        onError={onError}
        address={"agoric1tq3v943uaycqp90qvuyaqzwdc3eh52xzrcl4p6"}
        chainId={"agoriclocal"}
      />
    </div>
  );
};

export default WalletBridge;
