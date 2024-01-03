import axios from "axios";
import { QueryClient } from "react-query";

import { BASE_URL } from "../constants";

export const api = axios.create({ responseType: "json", baseURL: BASE_URL });

if (import.meta.env.NODE_ENV === "development") {
  api.interceptors.request.use((request) => {
    console.log("Starting Request", request);
    return request;
  });
}

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.NODE_ENV === "development") {
      console.log("Response:", response);
    }
    return response;
  },
  (err) => {
    if (import.meta.env.NODE_ENV === "development") {
      console.warn("Response Error:", err);
    }
    return Promise.reject(err.response.data);
  },
);

export const queryClient = new QueryClient();
