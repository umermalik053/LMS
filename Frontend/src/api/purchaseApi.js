import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = "http://localhost:8080/api/v1/purchase";

const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSessions: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: {courseId},
      })
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getPurchaseCourse: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    })


  }),
});

export const { useCreateCheckoutSessionsMutation, useGetCourseDetailWithStatusQuery, useGetPurchaseCourseQuery } = purchaseApi;
 export default purchaseApi;