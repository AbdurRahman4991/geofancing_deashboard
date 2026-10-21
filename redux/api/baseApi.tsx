

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://192.168.20.203:8000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${API_ORIGIN}/api`;
const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_REPOSITORY = "AbdurRahman4991/geofancing_deashboard";
export const GITHUB_TAGS_URL = `${GITHUB_API_BASE_URL}/repos/${GITHUB_REPOSITORY}/tags`;

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,

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
    "employeeHierarchyAssignments","AttendanceRole", "departments", "hierarchyNodes"
  ],
});

export const imageUrl = `${API_ORIGIN}/image/`;

