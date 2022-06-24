import { FC, useState } from "react";

import { text } from "../../assets";
import {
  NotificationWrapper,
  NotificationContent,
  NotificationContainer,
  InfoWrapper,
  InfoContainer,
  TickContainer,
  Tick,
  Content,
  BoldText,
  BodyText,
  NotificationHeader,
  NotificationItemContainer,
  BodyMessage,
  MessageContainer,
} from "./styles";
import { ButtonText, HorizontalDivider, MenuText, SecondaryButton } from "../atoms";
import { useViewport } from "../../hooks";
import { useNotifications } from "../../service";
import { LoadingPage } from "../content-loader";
import { NotificationDetail } from "../notification-detail";

export const NotificationCard: FC = () => {
  const { data: notifications, isLoading: isLoadingNotifications } = useNotifications();
  const [showDetail, setShowDetail] = useState(false);
  const [info, setInfo] = useState("");
  const [title, setTitle] = useState("");
  const { width, height } = useViewport();

  // TODO: add empty view
  if (!notifications || !notifications.length) return <></>;

  if (isLoadingNotifications) return <LoadingPage />;

  const closeToast = () => {
    setShowDetail(!showDetail);
  };

  return (
    <>
      <NotificationWrapper width={width} height={height}>
        <NotificationContent>
          <MenuText>{text.notifications.notifications}</MenuText>
        </NotificationContent>
        <NotificationContainer>
          {notifications.map((notification, index) => (
            <InfoWrapper key={index}>
              <InfoContainer>
                <TickContainer>
                  <Tick />
                </TickContainer>
                <Content>
                  <NotificationItemContainer>
                    <NotificationHeader>
                      <MessageContainer>
                        {notification.status === "sold" && (
                          <BodyMessage>{text.notifications.your}</BodyMessage>
                        )}
                        <BodyText>
                          {notification.status === "sold" ? text.notifications.item : text.notifications.the}
                        </BodyText>
                        <BoldText>
                          {notification.status === "sold"
                            ? text.param.itemQuoted(notification.itemName)
                            : text.param.itemQuoted(notification.itemName)}
                        </BoldText>
                        <BodyText>
                          {notification.status === "sold"
                            ? text.param.notificationSold(notification.price || 0)
                            : text.notifications.itemIsSuccesfully}
                        </BodyText>
                      </MessageContainer>
                      <SecondaryButton
                        onClick={() => {
                          setShowDetail(true);
                          setInfo(
                            notification.status === "sold"
                              ? text.param.yourItemHasBeenSold(notification.itemName, notification.price || 0)
                              : text.param.theItemIsSussfullyPurchased(notification.itemName),
                          );
                          setTitle(
                            notification.status === "sold"
                              ? text.notifications.yourItemHasBeenPurchased
                              : text.notifications.yourItemHasBeenPurchased,
                          );
                        }}
                      >
                        <ButtonText>{text.notifications.viewItem}</ButtonText>
                      </SecondaryButton>
                    </NotificationHeader>
                  </NotificationItemContainer>
                  <HorizontalDivider />
                </Content>
              </InfoContainer>
            </InfoWrapper>
          ))}
        </NotificationContainer>
      </NotificationWrapper>
      {!!showDetail && <NotificationDetail title={title} info={info} closeToast={closeToast} />}
    </>
  );
};
