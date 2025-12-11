import SideNav from '@/components/SideNav';
import BottomNav from '@/components/BottomNav';
import { SessionProvider } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
        <div className="flex h-screen bg-white">
        <SideNav />
        <main className="flex-1 md:ml-64 pb-16 md:pb-0 overflow-y-auto">
            <div className="mx-auto max-w-2xl min-h-screen">
            {children}
            </div>
        </main>
        <BottomNav />
        </div>
    </SessionProvider>
  );
}
