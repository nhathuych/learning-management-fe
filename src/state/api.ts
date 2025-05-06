import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

enum Tags {
  Courses = 'Courses',
};

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: [Tags.Courses],  // 👈 Step 1: define tag types for cache management
  endpoints: (build) => ({
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: 'courses',
        params: { category },
      }),
      providesTags: [Tags.Courses],  // 👈 Step 2: provide tags for the cached query result
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: Tags.Courses, id }],  // 👈 Step 2: assigns a per-item cache tag, allowing Redux to refetch only the affected course on update/delete
    }),
  }),
});

// These are auto-generated React Hooks by RTK Query for fetching courses and a specific course based on the respective endpoints
export const {
  useGetCoursesQuery,
  useGetCourseQuery,
} = api;
