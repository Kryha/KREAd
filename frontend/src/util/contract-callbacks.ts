import { HandleOfferResult, HandleOfferResultBuilderFunction, OFFER_STATUS, OfferStatusType } from "../interfaces";

export const handleOfferResultBuilder: HandleOfferResultBuilderFunction = (errorCallback, refundCallback, successCallback) => { 
  return {
    errorCallbackFunction: errorCallback,
    refundCallbackFunction: refundCallback,
    successCallbackFunction: successCallback,
    getHandleOfferResult() {
      return (({ status, data }: { status: OfferStatusType; data: object }) => {
        switch (status) {
          case OFFER_STATUS.error: {
            console.error("Offer error", data);
            if (this.errorCallbackFunction) this.errorCallbackFunction(JSON.stringify(data));
            break;
          }
          case OFFER_STATUS.refunded: {
            console.error("Offer refunded", data);
            if (this.refundCallbackFunction) this.refundCallbackFunction();
            break;
          }
          case OFFER_STATUS.accepted: {
            console.info("Offer accepted", data);
            if (this.successCallbackFunction) this.successCallbackFunction();
            break;
          }
          case OFFER_STATUS.seated: {
            console.info("Offer accepted", data);
            if (this.successCallbackFunction) this.successCallbackFunction();
            break;
          }
        }
      }).bind<HandleOfferResult>(this);
    },
  };
};