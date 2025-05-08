import { useClerk, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import { BookOpen, Briefcase, DollarSign, LogOut, PanelLeft, Settings, User } from 'lucide-react'
import Loading from './Loading'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const AppSidebar = () => {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { toggleSidebar } = useSidebar()
  const pathName = usePathname()

  const navLinks = {
    student: [
      { icon: BookOpen,  label: 'Courses',  href: '/user/courses' },
      { icon: Briefcase, label: 'Billings', href: '/user/billing' },
      { icon: User,      label: 'Profile',  href: '/user/profile' },
      { icon: Settings,  label: 'Settings', href: '/user/settings' },
    ],
    teacher: [
      { icon: BookOpen,   label: 'Courses',  href: '/teacher/courses' },
      { icon: DollarSign, label: 'Billings', href: '/teacher/billing' },
      { icon: User,       label: 'Profile',  href: '/teacher/profile' },
      { icon: Settings,   label: 'Settings', href: '/teacher/settings' },
    ],
  }

  if (!isLoaded) return <Loading />
  if (!user) return <div>User not found.</div>

  const userType = (user.publicMetadata.userType as 'student' | 'teacher') || 'student'
  const currentNavLinks = navLinks[userType]

  return (
    <Sidebar collapsible='icon' style={{ height: '100vh' }} className='bg-customgreys-primarybg shadow-lg border-none'>
      <SidebarHeader>
        <SidebarMenu className='app-sidebar__menu'>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => toggleSidebar()} size='lg' className='group hover:bg-customgreys-secondarybg'>
              <div className='group app-sidebar__logo-container'>
                <div className='app-sidebar__logo-wrapper'>
                  <Image src='/clerk.png' alt='logo' width={25} height={20} priority className='object-contain app-sidebar__logo' />
                  <p className='app-sidebar__title'>HuyLearning</p>
                </div>
                <PanelLeft className='app-sidebar__collapse-icon' />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className='app-sidebar__nav-menu'>
          {currentNavLinks.map((link) => {
            const isActive = pathName.startsWith(link.href);
            return (
              <SidebarMenuItem key={link.href} className={cn('app-sidebar__nav-item', isActive && 'bg-gray-800')}>
                <SidebarMenuButton asChild size='lg' className={cn('app-sidebar__nav-button', !isActive && 'text-customgreys-dirtyGrey')}>
                  <Link href={link.href} className='app-sidebar__nav-link' scroll={false}>
                    <link.icon className={isActive ? 'text-white-50' : 'text-gray-500'} />
                    <span className={cn('app-sidebar__nav-text', isActive ? 'text-white-50' : 'text-gray-500')}>
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className='app-sidebar__active-indicator' />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={() => signOut()} className='app-sidebar__signout'>
                <LogOut className='mr-2 w-6 h-6' />
                <span>Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
