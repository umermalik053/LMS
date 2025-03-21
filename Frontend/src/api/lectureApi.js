import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Ensure `/react` is used for hooks.

const Lecture_URI = "http://localhost:8080/api/v1/lecture";

const lectureApi = createApi({
    reducerPath: "lectureApi",
    providesTags:["refetch"],
    baseQuery: fetchBaseQuery({
        baseUrl: Lecture_URI,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        createLecture: builder.mutation({
            query: ({courseData,CourseId}) => ({
                url: `/${CourseId}`,
                method: "POST",
                body: courseData,
            }),
            invalidatesTags:["refetch"],

        }),
        getAllLecturesByCourseId: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET",
            }),
            providesTags: ["refetch"]

        }),
        updateLecture: builder.mutation({
            query: ({courseData, courseId, lectureId}) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: courseData,
            }),
            invalidatesTags:["refetch"],
        }),
        deleteLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/delete/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags:["refetch"],
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/get/${lectureId}`,
                method: "GET",
            }),
            providesTags: ["refetch"]
        }),
        
       
    }),
});

export const { useCreateLectureMutation , useGetAllLecturesByCourseIdQuery, useUpdateLectureMutation, useDeleteLectureMutation, useGetLectureByIdQuery } = lectureApi; // Export correctly
export default lectureApi;
