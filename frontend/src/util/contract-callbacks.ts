import { HandleOfferResultBuilderFunction } from "../interfaces";

export const handleOfferResultBuilder: HandleOfferResultBuilderFunction = (errorCallback?, refundCallback?, successCallback?) => {
    return ({ status, data }: { status: string; data: object }) => {
      if (status === "error") {
        console.error("Offer error", data);
        if (errorCallback) errorCallback(JSON.stringify(data));
      }
      if (status === "refunded") {
        console.error("Offer refunded", data);
        if (refundCallback) refundCallback();
      }
      if (status === "accepted") {
        console.info("Offer accepted", data);
        if (successCallback) successCallback();
      }
    };
  };

} 
