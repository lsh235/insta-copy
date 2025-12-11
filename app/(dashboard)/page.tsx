import { getFeed } from '@/actions/feed'
import Post from '@/components/Post'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth()
  
  if (!session) {
      redirect('/login')
  }

  const posts = await getFeed()

  return (
    <div className="flex flex-col items-center py-4 md:py-8">
      <div className="w-full max-w-[470px]">
        {/* Stories Placeholder */}
        <div className="flex gap-4 overflow-x-auto p-4 bg-white border border-gray-200 rounded-lg mb-4 no-scrollbar">
             {[...Array(6)].map((_, i) => (
                 <div key={i} className="flex flex-col items-center min-w-[64px]">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                         <div className="w-full h-full rounded-full bg-white p-[2px]">
                             <div className="w-full h-full bg-gray-200 rounded-full" />
                         </div>
                     </div>
                     <span className="text-xs mt-1">User {i+1}</span>
                 </div>
             ))}
        </div>

        {posts.length > 0 ? (
            posts.map(post => (
                <Post key={post.id} post={post} />
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-500">No posts yet. Follow someone or create a post!</p>
            </div>
        )}
      </div>
    </div>
  )
}
