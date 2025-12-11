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
    <div className="flex flex-col items-center py-0 md:py-8 min-h-screen bg-gray-50">
      <div className="w-full max-w-[630px]">
        {/* Stories Section */}
        <div className="flex gap-4 overflow-x-auto p-4 bg-white border-b md:border md:rounded-lg mb-0 md:mb-4 no-scrollbar">
             {[...Array(8)].map((_, i) => (
                 <div key={i} className="flex flex-col items-center min-w-[64px]">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                         <div className="w-full h-full rounded-full bg-white p-[2px]">
                             <div className="w-full h-full bg-gray-200 rounded-full" />
                         </div>
                     </div>
                     <span className="text-xs mt-1 text-gray-600">user{i+1}</span>
                 </div>
             ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-0 md:space-y-4">
          {posts.length > 0 ? (
              posts.map(post => (
                  <Post key={post.id} post={post} />
              ))
          ) : (
              <div className="bg-white border md:rounded-lg p-10 text-center">
                  <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Welcome to Instagram!</h3>
                      <p className="text-gray-500 mb-4">When you follow people, you'll see their posts here.</p>
                      <a href="/search" className="text-blue-500 hover:underline font-semibold">
                          Find people to follow
                      </a>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
