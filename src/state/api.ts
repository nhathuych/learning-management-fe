import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query';
import { User } from '@clerk/nextjs/server';
import { Clerk } from '@clerk/clerk-js';
import { toast } from 'sonner';

enum Tags {
  Courses = 'Courses',
  Users = 'Users',
  UserCourseProgress = 'UserCourseProgress',
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
  tagTypes: [Tags.Courses, Tags.Users, Tags.UserCourseProgress],  // 👈 Step 1: define tag types for cache management
  endpoints: (build) => ({
    // COURSES APIS
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

    createCourse: build.mutation<Course, { teacherId: string, teacherName: string }>({
      query: (body) => ({
        url: `courses`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [Tags.Courses],
    }),

    updateCourse: build.mutation<Course, { courseId: string, formData: FormData }>({
      query: ({ courseId, formData }) => ({
        url: `courses/${courseId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [{type: Tags.Courses, id: courseId}],
    }),

    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({ url: `courses/${courseId}`, method: 'DELETE', }),
      invalidatesTags: [Tags.Courses],
    }),

    // USER CLERK API
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: [Tags.Users],  // 👈 Step 3: invalidate user-related cache so that queries with `Tags.Users` are refetched after update
    }),

    // TRANSACTION APIS
    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`
    }),

    createStripePaymentIntent: build.mutation<{ clientSecret: string }, { amount: number }>({
      query: ({ amount }) => ({
        url: `transactions/stripe/payment-intent`,
        method: 'POST',
        body: { amount },
      }),
    }),

    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: 'transactions/',
        method: 'POST',
        body: transaction,
      })
    }),

    // USER COURSE PROGRESS
    getUserEnrolledCourses: build.query<Course[], string>({
      query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
      providesTags: [Tags.Courses, Tags.UserCourseProgress],
    }),

    getUserCourseProgress: build.query<
      UserCourseProgress,
      { userId: string; courseId: string }
    >({
      query: ({ userId, courseId }) => `users/course-progress/${userId}/courses/${courseId}`,
      providesTags: [Tags.UserCourseProgress],
    }),

    updateUserCourseProgress: build.mutation<
      UserCourseProgress,
      {
        userId: string;
        courseId: string;
        progressData: {
          sections: SectionProgress[];
        };
      }
    >({
      query: ({ userId, courseId, progressData }) => ({
        url: `users/course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: [Tags.UserCourseProgress],
      async onQueryStarted({ userId, courseId, progressData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getUserCourseProgress",
            { userId, courseId },
            (draft) => {
              Object.assign(draft, {
                ...draft,
                sections: progressData.sections,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// These are auto-generated React Hooks by RTK Query for fetching courses and a specific course based on the respective endpoints
export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateUserMutation,
  useGetTransactionsQuery,
  useCreateStripePaymentIntentMutation,
  useCreateTransactionMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} = api;
