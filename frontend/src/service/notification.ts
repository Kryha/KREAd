import { useQuery, UseQueryResult } from "react-query";

import { Notification } from "../interfaces";
import { FakeNotifications } from "./fake-notifications";

export const useNotifications = (): UseQueryResult<Notification[]> => {
  return useQuery(["notification", "all"], async () => {
    //  TODO: intergrate me

    return FakeNotifications;
  });
};
