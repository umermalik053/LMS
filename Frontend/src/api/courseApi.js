import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Ensure `/react` is used for hooks.

const Course_URI = "http://localhost:8080/api/v1/course";

const courseApi = createApi({
  reducerPath: "courseApi",
  providesTags: ["refetch"],
  baseQuery: fetchBaseQuery({
    baseUrl: Course_URI,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "/",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["refetch"],
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["refetch"],

      // transformResponse: (response) => response.data
    }),
    getPublishedCourses: builder.query({
      query: () => ({
        url: "/published",
        method: "GET",
      }),
      providesTags: ["refetch"],
    }),
    updateCourses: builder.mutation({
      query: ({ courseData, CourseId }) => ({
        url: `/${CourseId}`,
        method: "PUT",
        body: courseData,
      }),
      invalidatesTags: ["refetch"],
    }),
    getCoursesById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["refetch"],
    }),
    publishToggle: builder.mutation({
      query: ({ courseId, publish }) => ({
        url: `/coursePublish/${courseId}?publish=${publish}`,
        method: "PUT",
      }),
      invalidatesTags: ["refetch"],
    }),
    deleteLectureAndCourse: builder.mutation({
      query: (courseId) => ({
        url: `/courseDelete/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["refetch"],
    }),
    getSearchCourses: builder.query({
      query: ({ query, category, sortByPrice }) => {
        // build queryString
        let queryString = `search?query=${encodeURIComponent(query)}`;

        // append category
        if (category && category.length > 0) {
          const categoryString = category.map(encodeURIComponent).join(", ");
          queryString += `&category=${categoryString}`;
        }

        // append sortByPrice
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: `/${queryString}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetPublishedCoursesQuery,
  useGetAllCoursesQuery,
  useUpdateCoursesMutation,
  useGetCoursesByIdQuery,
  usePublishToggleMutation,
  useDeleteLectureAndCourseMutation,
  useGetSearchCoursesQuery,
} = courseApi; 
export default courseApi;
