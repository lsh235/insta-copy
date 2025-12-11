import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Authorize called with:", credentials?.email);
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
              console.log("User not found:", email);
              return null;
          }
          console.log("User found:", user.email);
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) {
              console.log("Password match for:", email);
              return user;
          } else {
              console.log("Password mismatch for:", email);
          }
        } else {
            console.log("Invalid credentials format");
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).username = token.username as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
