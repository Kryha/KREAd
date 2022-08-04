import { FC, useState } from "react";

import { text } from "../../assets";
import { NotificationWrapper, NotificationContent, NotificationContainer, InfoWrapper, InfoContainer, TickContainer, Tick } from "./styles";
import { MenuText } from "../atoms";
import { useViewport } from "../../hooks";
import { useNotifications } from "../../service";
import { LoadingPage } from "../content-loader";
import { NotificationDetail } from "../notification-detail";
import { NotificationInfo } from "../notification-info";
import { OverviewEmpty } from "../overview-empty";

export const NotificationCard: FC = () => {
  const { data: notifications, isLoading: isLoadingNotifications } = useNotifications();
  const [showDetail, setShowDetail] = useState(false);
  const [info, setInfo] = useState("");
  const [title, setTitle] = useState("");
  const { width, height } = useViewport();

  if (!notifications || !notifications.length) return <OverviewEmpty />;

  if (isLoadingNotifications) return <LoadingPage spinner={false} />;

  const closeToast = () => {
    setShowDetail(!showDetail);
  };
  const setInfomation = (showNotification: boolean, information: string, heading: string) => {
    setInfo(information);
    setTitle(heading);
    setShowDetail(showNotification);
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
                <NotificationInfo notification={notification} setInfo={setInfomation} />
              </InfoContainer>
            </InfoWrapper>
          ))}
        </NotificationContainer>
      </NotificationWrapper>
      {!!showDetail && <NotificationDetail title={title} info={info} closeToast={closeToast} />}
    </>
  );
};
