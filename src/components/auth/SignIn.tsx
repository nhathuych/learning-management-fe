'use client'

import { SignIn, useUser } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const SignInComponent = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const searchParams = useSearchParams()
  const isCheckoutPage = searchParams.get('showSignUp') !== null
  const courseId = searchParams.get('id')
  const signUpUrl = isCheckoutPage ? `/checkout?step=1&id=${courseId}&showSignUp=true` : '/signup'

  const getRedirectUrl = () => {
    if (isCheckoutPage) return `/checkout?step=2&id=${courseId}&showSignUp=true`

    const userType = user?.publicMetadata?.userType as string
    return userType === 'teacher' ? '/teacher/courses' : '/user/courses'
  }

  // Don't render SignIn form if user is loading or already signed in
  return (!isLoaded || isSignedIn) ? null : (
    <SignIn
      signUpUrl={signUpUrl}
      forceRedirectUrl={getRedirectUrl()}
      routing='hash'
      afterSignOutUrl='/'
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: 'flex justify-center items-center py-5',
          cardBox: 'shadow-none',
          card: 'bg-customgreys-secondarybg shadow-none w-full',
          formFieldLabel: 'text-white-50 font-normal',
          formButtonPrimary: 'bg-indigo-600 text-white-100 !shadow-none hover:bg-indigo-700',
          formFieldInput: 'bg-customgreys-primarybg text-white-50 !shadow-none',
          footerActionLink: 'text-indigo-600 hover:text-indigo-500',
          footer: {
            background: '#25262F',
            padding: '0rem 2.5rem',
            '& > div > div:nth-child(1)': {
              background: '#25262F',
            }
          }
        }
      }}
    />
  )
}

export default SignInComponent
