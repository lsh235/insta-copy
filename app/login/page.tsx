import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <h1 className="text-2xl font-bold">Instagram Clone</h1>
          </div>
        </div>
        <div className="bg-gray-50 px-6 pb-4 pt-8 shadow-md rounded-lg">
             <h2 className="mb-3 text-2xl font-bold text-black">Log in</h2>
            <LoginForm />
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
      </div>
    </main>
  );
}
