import { AddOfferCallback, HandleOfferResult, HandleOfferResultBuilderFunction, OFFER_STATUS, OfferStatusType } from "../interfaces";

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
        }
      }).bind<HandleOfferResult>(this);
    },
  };
};

export const formOfferResultCallback = (callback: AddOfferCallback) => (({ status, data }: { status: OfferStatusType; data: object }) => {
  switch (status) {
      case OFFER_STATUS.error: {
        console.error("Offer error", JSON.stringify(data));
        if (callback.error) callback.error();
        break;
      }
      case OFFER_STATUS.refunded: {
        console.error("Offer refunded", JSON.stringify(data));
        if (callback.refunded) callback.refunded();
        break;
      }
      case OFFER_STATUS.accepted: {
        console.info("Offer accepted", JSON.stringify(data));
        if (callback.accepted) callback.accepted();
        break;
      }
      case OFFER_STATUS.seated: {
        console.info("Offer seated", JSON.stringify(data));
        if (callback.seated) callback.seated();
        break;
      }
    }
    if(callback.setIsLoading) callback.setIsLoading(false);
    if(callback.settled) callback.settled();

  });