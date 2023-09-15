import { FC } from "react";

import { text } from "../../assets";
import { Content, BoldText, BodyText, NotificationHeader, NotificationItemContainer, BodyMessage, MessageContainer } from "./styles";
import { ButtonText, HorizontalDivider, SecondaryButton } from "../atoms";
import { Notification } from "../../interfaces";

interface NotificationInfoProps {
  notification: Notification;
  setInfo: (showNotification: boolean, information: string, heading: string) => void;
}

export const NotificationInfo: FC<NotificationInfoProps> = ({ notification, setInfo }) => {
  return (
    <Content>
      <NotificationItemContainer>
        <NotificationHeader>
          <MessageContainer>
            {notification.status === "sold" && <BodyMessage>{text.notifications.your}</BodyMessage>}
            <BodyText>{notification.status === "sold" ? text.notifications.item : text.notifications.the}</BodyText>
            <BoldText>
              {notification.status === "sold" ? text.param.itemQuoted(notification.itemName) : text.param.itemQuoted(notification.itemName)}
            </BoldText>
            <BodyText>
              {notification.status === "sold" ? text.param.notificationSold(notification.price || 0) : text.notifications.itemIsSuccesfully}
            </BodyText>
          </MessageContainer>
          <SecondaryButton
            onClick={() =>
              setInfo(
                true,
                notification.status === "sold"
                  ? text.param.yourItemHasBeenSold(notification.itemName, notification.price || 0)
                  : text.param.theItemIsSussfullyPurchased(notification.itemName),
                notification.status === "sold" ? text.notifications.yourItemHasBeenPurchased : text.notifications.yourItemHasBeenPurchased,
              )
            }
          >
            <ButtonText>{text.notifications.viewItem}</ButtonText>
          </SecondaryButton>
        </NotificationHeader>
      </NotificationItemContainer>
      <HorizontalDivider />
    </Content>
  );
};
