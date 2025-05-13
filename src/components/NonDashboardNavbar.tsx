'use client'

import { Bell, BookOpen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const NonDashboardNavbar = () => {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.userType as 'student' | 'teacher'

  return (
    <nav className='nondashboard-navbar'>
      <div className='nondashboard-navbar__container'>
        <div className='nondashboard-navbar__search'>
          <Link href='/' className='nondashboard-navbar__brand' scroll={false}>
            Huy Learning
          </Link>

          <div className='flex items-center gap-4'>
            <div className='group relative'>
              <Link href='/search' className='nondashboard-navbar__search-input' scroll={false}>
                <span className='hidden sm:inline'>Search Courses</span>
                <span className='sm:hidden'>Search</span>
              </Link>
              <BookOpen size={18} className='nondashboard-navbar__search-icon' />
            </div>
          </div>
        </div>
      </div>

      <div className='nondashboard-navbar__actions'>
        <Button className='nondashboard-navbar__notification-button'>
          <span className='nondashboard-navbar__notification-indicator'></span>
          <Bell className='nondashboard-navbar__notification-icon' />
        </Button>

        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: dark,
              elements: {
                userButtonOuterIdentifier: 'text-customgreys-dirtyGrey',
                userButtonBox: 'scale-90 sm:scale-100',
              },
            }}
            userProfileMode='navigation'
            userProfileUrl={ userRole === 'teacher' ? '/teacher/profile' : '/user/profile' }
          />
        </SignedIn>

        <SignedOut>
          <Link href='/signin' className='nondashboard-navbar__auth-button--login' scroll={false}>Log In</Link>
          <Link href='/signup' className='nondashboard-navbar__auth-button--signup' scroll={false}>Register</Link>
        </SignedOut>
      </div>
    </nav>
  )
}

export default NonDashboardNavbar
