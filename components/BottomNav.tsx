'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

export default function BottomNav() {
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
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {links.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
            >
              <LinkIcon
                className={clsx(
                  'w-6 h-6 mb-1',
                  isActive ? 'text-black fill-current' : 'text-gray-500'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="sr-only">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
