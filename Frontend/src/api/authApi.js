import { loginReducer, logoutReducer } from "@/Store/feature/authslice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/api/v1/user";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    RegisterUser: builder.mutation({
      query: (registerData) => ({
        method: "POST",
        url: "/register",
        body: registerData,
      }),
    }),
    LoginUser: builder.mutation({
      query: (loginData) => ({
        method: "POST",
        url: "/login",
        body: loginData,
      }),
    }),
    async onQueryStarted(_, { queryFulfilled, dispatch }) {
      try {
        const result = await queryFulfilled;
        dispatch(loginReducer({ user: result.data.user }));
      } catch (error) {}
    },
    LogoutUser: builder.mutation({
      query: () => ({
        method: "GET",
        url: "/logout",
        credentials: "include",
      }),
      async onQueryStarted(_, { quer, dispatch }) {
        try {
          dispatch(logoutReducer());
        } catch (error) {}
      },
    
    }),
    LoadUser: builder.query({
      query: () => ({
        method: "GET",
        url: "/profile",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(loginReducer({ user: result.data.data }));
        } catch (error) {}
      },
    }),
    UpdateProfile: builder.mutation({
      query: (updateData) => ({
        method: "PUT",
        url: "/profileUpdate",
        body: updateData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateProfileMutation,
  useLogoutUserMutation,
} = authApi;

export default authApi;
