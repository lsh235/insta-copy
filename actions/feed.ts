'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function getFeed() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    // Return empty feed or public posts if desired
    return []
  }

  // Get IDs of users the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  })
  
  const followingIds = following.map(f => f.followingId)
  
  // Fetch posts from self and following
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: [...followingIds, userId],
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
      likes: {
        where: { userId }, // Check if current user liked
        select: { userId: true },
      },
      _count: {
        select: { likes: true, comments: true },
      },
      comments: {
         take: 2,
         orderBy: { createdAt: 'desc' },
         include: {
             author: {
                 select: { username: true }
             }
         }
      }
    },
  })

  return posts.map(post => ({
    ...post,
    isLiked: post.likes.length > 0,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
  }))
}
