import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import authApi from "@/api/authApi.js";
import courseApi from "@/api/courseApi.js";
import lectureApi from "@/api/lectureApi.js";
import purchaseApi from "@/api/purchaseApi.js";
import progressApi from "@/api/courseProgressApi.js";

const store = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware()
      .concat(authApi.middleware)
      .concat(courseApi.middleware)
      .concat(lectureApi.middleware)
      .concat(purchaseApi.middleware)
      .concat(progressApi.middleware),
});

const initializeApp = () => {
  store.dispatch(
    authApi.endpoints.LoadUser.initiate({}, { forceRefetch: true })
  );
};

initializeApp();

export default store;
