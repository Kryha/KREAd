import { FC } from "react";
import { text } from "../../assets";
import { FadeInOut, Overlay, NotificationDetail } from "../../components";
import { NotificationWrapper } from "../../components/notification-detail/styles";

interface ToastGoToWalletProps {
  showToast: boolean;
  closeAndRedirect: ()=>void;
}

export const ToastGoToWallet: FC<ToastGoToWalletProps> = ({ showToast, closeAndRedirect }) => {
  return (
    <FadeInOut show={showToast} exiting={!showToast}>
      {showToast && <Overlay isOnTop={true} />}
      <NotificationWrapper showNotification={showToast}>
        <NotificationDetail
          title={text.general.goToYourWallet}
          info={text.general.yourActionIsPending}
          closeToast={closeAndRedirect}
          isError
        />
      </NotificationWrapper>
    </FadeInOut>
  );
};
