import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from '@clerk/nextjs/server';
import { Clerk } from '@clerk/clerk-js';
import { toast } from "sonner";

enum Tags {
  Courses = 'Courses',
  Users = 'Users',
};

const customBaseQuery = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  try {
    const baseQuery = fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      prepareHeaders: async (headers) => {
        const token = await window.Clerk?.session?.getToken()
        if (token) headers.set('Authorization', `Bearer ${token}`)

        return headers
      },
    })
    const result: any = await baseQuery(args, api, extraOptions)
    const isMutationRequest = (args as FetchArgs).method && (args as FetchArgs).method !== 'GET'
    if (result.error) {
      const errorData = result.error.data
      const errorMsg = errorData?.message || result.error.status.toString() || 'An error has occurred.'
      toast.error(`Error: ${errorMsg}`, {
        action: { label: 'Ok', onClick: () => {} },
      })
    } else if (isMutationRequest) {
      const successMsg = result.data?.message
      if (successMsg) toast.success(successMsg, {
        action: { label: 'Ok', onClick: () => {} },
      })
    }

    if (result.data) {
      result.data = result.data.data
    } else if (result.error?.status === 204 || result.meta?.response?.status === 204) {
      return { data: null }
    }

    return result
  } catch (error: unknown) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error.'
      }
    }
  }
}

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: [Tags.Courses, Tags.Users],  // 👈 Step 1: define tag types for cache management
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

    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: [Tags.Users],  // 👈 Step 3: invalidate user-related cache so that queries with `Tags.Users` are refetched after update
    }),
  }),
});

// These are auto-generated React Hooks by RTK Query for fetching courses and a specific course based on the respective endpoints
export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useUpdateUserMutation,
} = api;
