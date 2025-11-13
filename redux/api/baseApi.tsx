import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://192.168.20.203:4000/api/',
});

export const api = createApi({
  reducerPath: 'api',
  // keepUnusedDataFor: 0,
  baseQuery: baseQuery,
  
  endpoints: () => ({}),
  tagTypes: ["company"],
});


export const imageUrl = 'http://192.168.20.203:4000/image/';
//export const blogImg = 'http://192.168.20.203:4000/images/';