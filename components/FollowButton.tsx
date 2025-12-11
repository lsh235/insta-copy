'use client'

import { followUser, unfollowUser } from '@/actions/user'
import { useState, useTransition } from 'react'

export default function FollowButton({ 
  userId, 
  initialIsFollowing 
}: { 
  userId: string, 
  initialIsFollowing: boolean 
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()

  const handleFollow = () => {
    startTransition(async () => {
        setIsFollowing(!isFollowing)
        if (isFollowing) {
            await unfollowUser(userId)
        } else {
            await followUser(userId)
        }
    })
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`px-4 py-1.5 rounded-lg font-semibold text-sm ${
        isFollowing 
            ? 'bg-gray-100 text-black hover:bg-gray-200' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
