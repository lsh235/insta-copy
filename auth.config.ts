import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // Added later in auth.ts
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/') && !nextUrl.pathname.startsWith('/login') && !nextUrl.pathname.startsWith('/signup');
      
      // Allow public access to login and signup
      if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup')) {
        if (isLoggedIn) {
             return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }
      
      // Protect other routes
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
