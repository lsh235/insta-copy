'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function getUserProfile(username: string) {
  const session = await auth()
  const currentUserId = session?.user?.id

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          posts: true,
          followedBy: true,
          following: true,
        },
      },
    },
  })

  if (!user) return null

  let isFollowing = false
  if (currentUserId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: user.id,
        },
      },
    })
    isFollowing = !!follow
  }

  return { ...user, isFollowing, isCurrentUser: currentUserId === user.id }
}

export async function followUser(userIdToFollow: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  await prisma.follow.create({
    data: {
        followerId: session.user.id,
        followingId: userIdToFollow
    }
  })

  revalidatePath('/')
  // We can't easily know the username of the user being followed here without another query, 
  // but usually we are on their profile page so we should revalidate that path.
  // Ideally we pass the username to this action or just revalidate path from client.
  // For simplicity, we revalidate all.
}

export async function unfollowUser(userIdToUnfollow: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  await prisma.follow.delete({
    where: {
        followerId_followingId: {
            followerId: session.user.id,
            followingId: userIdToUnfollow
        }
    }
  })
  
  revalidatePath('/')
}
