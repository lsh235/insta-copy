'use client'

import Image from 'next/image'
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import { useOptimistic, startTransition } from 'react'
import { toggleLike, addComment } from '@/actions/interactions'
import clsx from 'clsx'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface PostProps {
  post: {
    id: string
    imageUrl: string
    caption: string | null
    createdAt: Date
    author: {
      username: string
      image: string | null
    }
    isLiked: boolean
    likesCount: number
    commentsCount: number
    comments: Array<{
        id: string
        text: string
        author: { username: string }
    }>
  }
}

export default function Post({ post }: PostProps) {
  const [optimisticLike, setOptimisticLike] = useOptimistic(
    { isLiked: post.isLiked, likesCount: post.likesCount },
    (state, newLikeState: boolean) => ({
      isLiked: newLikeState,
      likesCount: state.isLiked ? state.likesCount - 1 : state.likesCount + 1,
    })
  )

  const handleLike = async () => {
    startTransition(() => {
        setOptimisticLike(!optimisticLike.isLiked)
    })
    await toggleLike(post.id)
  }

  const handleComment = async (formData: FormData) => {
      const text = formData.get('comment') as string
      if (!text.trim()) return
      
      // Ideally we would optimistic update comments too, but simpler for now just to trigger action
      // The form will reset automatically if we use standard form action or we can clear input
      await addComment(post.id, text)
      // clear input manually or use ref
      const form = document.getElementById(`comment-form-${post.id}`) as HTMLFormElement
      form?.reset()
  }

  return (
    <div className="bg-white border-b border-gray-200 md:border md:rounded-lg mb-4">
      {/* Header */}
      <div className="flex items-center p-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3">
            {post.author.image ? (
                 <Image src={post.author.image} alt={post.author.username} width={32} height={32} />
            ) : (
                <div className="w-full h-full bg-gray-300" />
            )}
        </div>
        <Link href={`/${post.author.username}`} className="font-semibold text-sm hover:underline">
            {post.author.username}
        </Link>
        <span className="text-gray-500 text-xs ml-auto">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Image */}
      <div className="relative aspect-square w-full bg-black/5">
        <Image
          src={post.imageUrl}
          alt={post.caption || 'Post image'}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 600px"
          priority={false} // Lazy load by default
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center mb-2">
            <div className="flex gap-4">
                <button onClick={handleLike}>
                    <Heart 
                        className={clsx("w-7 h-7 transition-colors", optimisticLike.isLiked ? "fill-red-500 text-red-500" : "text-black hover:text-gray-600")}
                    />
                </button>
                <button>
                    <MessageCircle className="w-7 h-7 text-black hover:text-gray-600" />
                </button>
                <button>
                    <Send className="w-7 h-7 text-black hover:text-gray-600" />
                </button>
            </div>
            <div className="ml-auto">
                 <button>
                    <Bookmark className="w-7 h-7 text-black hover:text-gray-600" />
                </button>
            </div>
        </div>

        <div className="font-semibold text-sm mb-1">
            {optimisticLike.likesCount} likes
        </div>

        {post.caption && (
            <div className="mb-2">
                <span className="font-semibold text-sm mr-2">{post.author.username}</span>
                <span className="text-sm">{post.caption}</span>
            </div>
        )}
        
        {post.commentsCount > 2 && (
             <button className="text-gray-500 text-sm mb-2">
                View all {post.commentsCount} comments
             </button>
        )}

        {post.comments.map(comment => (
             <div key={comment.id} className="text-sm mb-1">
                 <span className="font-semibold mr-2">{comment.author.username}</span>
                 <span>{comment.text}</span>
             </div>
        ))}

        <form 
            id={`comment-form-${post.id}`}
            action={handleComment} 
            className="flex items-center mt-3 border-t border-gray-100 pt-3"
        >
            <input 
                name="comment" 
                type="text" 
                placeholder="Add a comment..." 
                className="flex-1 outline-none text-sm"
                autoComplete="off"
            />
            <button type="submit" className="text-blue-500 font-semibold text-sm opacity-50 hover:opacity-100 disabled:opacity-30">
                Post
            </button>
        </form>
      </div>
    </div>
  )
}
