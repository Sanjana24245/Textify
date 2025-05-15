
import { Icon, Icons } from '@/components/Icons'
import SignOutButton from '@/components/SignOutButton'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import SidebarChatList from '@/components/SidebarChatList'
import MobileChatLayout from '@/components/MobileChatLayout'
import { SidebarOption } from '@/types/typings'

interface LayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'Textify',
  description: 'Your dashboard',
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
]

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length

  return (
    <div className='flex h-screen w-full bg-gray-100'>
      {/* Mobile Layout */}
      <div className='md:hidden'>
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className='hidden md:flex h-full w-72 flex-col border-r border-gray-200 bg-white shadow-lg z-10'>
        {/* Logo */}
        <div className='flex h-16 items-center justify-center border-b border-gray-200'>
          <Link href='/dashboard' className='flex items-center gap-2'>
      
            <span className='text-lg font-bold text-gray-800'>Textify</span>
          </Link>
        </div>

        {/* Sidebar content */}
        <div className='flex-1 overflow-y-auto px-4 py-6 space-y-6'>
          {friends.length > 0 && (
            <>
              <h2 className='text-xs font-semibold text-gray-400 uppercase'>
                Your Chats
              </h2>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </>
          )}

          <div>
            <h2 className='text-xs font-semibold text-gray-400 uppercase'>
              Overview
            </h2>
            <ul className='mt-2 space-y-1'>
              {sidebarOptions.map((option) => {
                const Icon = Icons[option.Icon]
                return (
                  <li key={option.id}>
                    <Link
                      href={option.href}
                      className='flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition'>
                      <span className='flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 bg-white text-indigo-500'>
                        <Icon className='h-4 w-4' />
                      </span>
                      {option.name}
                    </Link>
                  </li>
                )
              })}

              <li>
                <FriendRequestSidebarOptions
                  sessionId={session.user.id}
                  initialUnseenRequestCount={unseenRequestCount}
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Profile + Sign out */}
        <div className='border-t border-gray-200 p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative h-10 w-10'>
              <Image
                fill
                className='rounded-full object-cover'
                src={session.user.image || ''}
                alt='User profile'
              />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900'>
                {session.user.name}
              </p>
              <p className='text-xs text-gray-500'>{session.user.email}</p>
            </div>
          </div>
          <SignOutButton className='h-8 w-8 text-gray-500 hover:text-red-500' />
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto p-6'>
        {children}
      </main>
    </div>
  )
}

export default Layout
