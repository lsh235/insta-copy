'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  const userId = session.user.id

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  })

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    })
  } else {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    })
  }
  
  // In a real app we might not want to revalidate the whole feed for one like,
  // but rely on client-side optimistic updates. 
  // However, revalidating ensures consistency.
  revalidatePath('/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revalidatePath(`/${(session.user as any).username}`)
}

export async function addComment(postId: string, text: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  await prisma.comment.create({
    data: {
      text,
      postId,
      authorId: session.user.id,
    },
  })

  revalidatePath('/')
}
