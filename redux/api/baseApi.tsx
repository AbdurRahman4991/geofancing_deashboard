

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.20.203:8000/api",

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");

    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "company", "employees", "geofences", "attendance", "employeeLocations","role", "permission", "user", "users",
    "countries","regions", "zones", "divisions", "districts", "subDistricts", "territories", "areas"
  ],
});

export const imageUrl = "http://192.168.20.203:8000/image/";