'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, Heart, User, LogOut, Instagram } from 'lucide-react';
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';

export default function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const username = (session?.user as any)?.username || 'me';

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Create', href: '/create', icon: PlusSquare },
    { name: 'Activity', href: '/activity', icon: Heart },
    { name: 'Profile', href: `/${username}`, icon: User },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:h-screen md:w-64 md:border-r md:border-gray-200 md:bg-white md:fixed md:left-0 md:top-0 px-4 py-8">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <Instagram /> Instagram
        </h1>
      </div>
      
      <div className="flex-1 space-y-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex items-center gap-4 px-4 py-3 rounded-md transition-colors',
                isActive
                  ? 'bg-gray-100 text-black font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <LinkIcon
                className={clsx('w-6 h-6', isActive && 'fill-current')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-base">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-4">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md w-full text-left"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-base">Log out</span>
        </button>
      </div>
    </div>
  );
}
