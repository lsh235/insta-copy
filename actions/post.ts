'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { saveFile } from '@/lib/upload'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const caption = formData.get('caption') as string
  const file = formData.get('file') as File

  if (!file) {
    throw new Error('No file uploaded')
  }

  const imageUrl = await saveFile(file)

  await prisma.post.create({
    data: {
      caption,
      imageUrl,
      authorId: session.user.id,
    },
  })

  revalidatePath('/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revalidatePath(`/${(session.user as any).username}`)
}
