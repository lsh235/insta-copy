'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

const SignupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  password: z.string().min(6),
  name: z.string().optional(),
})

export async function signup(prevState: string | undefined, formData: FormData) {
  const result = SignupSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success) {
    return 'Invalid input'
  }

  const { email, username, password, name } = result.data

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return 'User already exists'
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      }
    })
  } catch (error) {
    console.error(error)
    return 'Something went wrong'
  }
  
  await signIn('credentials', { email, password, redirectTo: '/' })
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', { 
      ...Object.fromEntries(formData),
      redirectTo: '/'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}
