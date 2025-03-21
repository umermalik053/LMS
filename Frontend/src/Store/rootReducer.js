import authApi  from "../api/authApi.js";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./feature/authslice"
import courseApi from "../api/courseApi.js";
import lectureApi from "@/api/lectureApi.js";
import purchaseApi from "@/api/purchaseApi.js";
import progressApi from "@/api/courseProgressApi.js";




const rootReducer = combineReducers({
      [authApi.reducerPath]: authApi.reducer,
      [courseApi.reducerPath]: courseApi.reducer,
      [lectureApi.reducerPath]: lectureApi.reducer,
      [purchaseApi.reducerPath]: purchaseApi.reducer,
      [progressApi.reducerPath]: progressApi.reducer,
      auth: authReducer
})

export default rootReducer;