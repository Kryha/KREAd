import { HandleOfferResult, HandleOfferResultBuilderFunction } from "../interfaces";

export const handleOfferResultBuilder: HandleOfferResultBuilderFunction = (errorCallback, refundCallback, successCallback) => { 
  return {
    errorCallbackFunction: errorCallback,
    refundCallbackFunction: refundCallback,
    successCallbackFunction: successCallback,
    getHandleOfferResult() {
      return (({ status, data }: { status: string; data: object }) => {
        console.log("HERE WITH STATUS: ", status)
        if (status === "error") {
          console.error("Offer error", data);
          if (this.errorCallbackFunction) this.errorCallbackFunction(JSON.stringify(data));
        }
        if (status === "refunded") {
          console.error("Offer refunded", data);
          if (this.refundCallbackFunction) this.refundCallbackFunction();
        }
        if (status === "accepted") {
          console.info("Offer accepted", data);
          if (this.successCallbackFunction) this.successCallbackFunction();
        }
      }).bind<HandleOfferResult>(this);
    },
  };
};
