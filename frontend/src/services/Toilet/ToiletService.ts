import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TOILET_SVC_URI } from "@/config/uris";

import {
  CreateToiletRequest,
  GetNearbvToiletsRequest,
  Toilet,
  UpdateToiletByIdRequest,
} from "./Toilet.types";

export const toiletApi = createApi({
  reducerPath: "toiletApi",
  baseQuery: fetchBaseQuery({ baseUrl: TOILET_SVC_URI }),
  tagTypes: ["Toilet"],
  endpoints: (builder) => ({
    getNearbyToilets: builder.query<Toilet[], GetNearbvToiletsRequest>({
      query: ({ minLat, minLng, maxLat, maxLng }) => ({
        url: "/nearby",
        params: { minLat, minLng, maxLat, maxLng },
      }),
      providesTags: [{ type: "Toilet" }],
    }),
    createToilet: builder.mutation<Toilet, CreateToiletRequest>({
      query: (createToiletRequestData) => ({
        url: "",
        method: "POST",
        body: createToiletRequestData,
      }),
    }),
    updateToiletById: builder.mutation<Toilet, UpdateToiletByIdRequest>({
      query: ({ id, ...updateToiletRequestData }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: updateToiletRequestData,
      }),
    }),
    deleteToiletById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLazyGetNearbyToiletsQuery,
  useCreateToiletMutation,
  useUpdateToiletByIdMutation,
  useDeleteToiletByIdMutation,
} = toiletApi;
