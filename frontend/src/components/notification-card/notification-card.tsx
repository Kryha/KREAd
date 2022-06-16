import { FC,  useState } from "react";

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
import {  ButtonText, HorizontalDivider, MenuText,  SecondaryButton } from "../atoms";
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

  if(isLoadingNotifications) return <LoadingPage />;

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
                  {notification.status === "sold" ?
                    (
                      <>
                        <NotificationItemContainer>
                          <NotificationHeader>
                            <MessageContainer>
                              <BodyMessage>{text.notifications.your}</BodyMessage>
                              <BodyText>{text.notifications.item}</BodyText>
                              <BoldText>{text.param.itemQuoted(notification.itemName)}</BoldText>
                              <BodyText>{text.param.notificationSold(notification.price || 0)}</BodyText>
                            </MessageContainer>
                            <SecondaryButton
                              onClick={() => {
                                setShowDetail(true);
                                setInfo(text.param.yourItemHasBeenSold(notification.itemName, notification.price || 0));
                                setTitle(text.notifications.yourItemHasBeenPurchased);
                              }}
                            >
                              <ButtonText>{text.notifications.viewItem}</ButtonText>
                            </SecondaryButton>
                          </NotificationHeader>
                        </NotificationItemContainer>
                        <HorizontalDivider />
                      </>
                    ) : (
                      <>
                        <NotificationItemContainer>
                          <NotificationHeader>
                            <MessageContainer>
                              <BodyMessage>{text.notifications.the}</BodyMessage>
                              <BoldText>{text.param.itemQuoted(notification.itemName)}</BoldText>
                              <BodyText>{text.notifications.itemIsSuccesfully}</BodyText>
                            </MessageContainer>
                            <SecondaryButton
                              onClick={() => {
                                setShowDetail(true);
                                setInfo(text.param.theItemIsSussfullyPurchased(notification.itemName));
                                setTitle(text.notifications.yourItemHasBeenPurchased);
                              }}
                            >
                              <ButtonText>{text.notifications.viewItem}</ButtonText>
                            </SecondaryButton>
                          </NotificationHeader>
                        </NotificationItemContainer>
                        <HorizontalDivider />
                      </>
                    )
                  }
                </Content>
              </InfoContainer>
            </InfoWrapper>
          ))}
        </NotificationContainer>
      </NotificationWrapper>
      {Boolean(showDetail) && (
        <NotificationDetail title={title} info={info} closeToast={closeToast} />
      )}
    </>
  );
};
