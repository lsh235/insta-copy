import { getUserProfile } from '@/actions/user'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import FollowButton from '@/components/FollowButton'
import { Settings, Grid, Bookmark, User as UserIcon } from 'lucide-react'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getUserProfile(username)

  if (!profile) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-8 items-center md:items-start border-b border-gray-200">
         <div className="w-20 h-20 md:w-36 md:h-36 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
             {profile.image ? (
                 <Image src={profile.image} alt={profile.username} width={150} height={150} />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-300">
                     <span className="text-2xl text-gray-500">{profile.username[0].toUpperCase()}</span>
                 </div>
             )}
         </div>

         <div className="flex flex-col gap-4 flex-1">
             <div className="flex flex-col md:flex-row items-center gap-4">
                 <h1 className="text-xl md:text-2xl">{profile.username}</h1>
                 {profile.isCurrentUser ? (
                     <div className="flex gap-2">
                        <button className="bg-gray-100 px-4 py-1.5 rounded-lg font-semibold text-sm">Edit profile</button>
                        <button className="bg-gray-100 p-1.5 rounded-lg"><Settings size={20} /></button>
                     </div>
                 ) : (
                     <FollowButton userId={profile.id} initialIsFollowing={profile.isFollowing} />
                 )}
             </div>

             <div className="flex gap-6 md:gap-10 justify-center md:justify-start text-sm md:text-base">
                 <div className="flex flex-col md:flex-row gap-1 items-center">
                     <span className="font-bold">{profile._count.posts}</span> posts
                 </div>
                 <div className="flex flex-col md:flex-row gap-1 items-center">
                     <span className="font-bold">{profile._count.followedBy}</span> followers
                 </div>
                 <div className="flex flex-col md:flex-row gap-1 items-center">
                     <span className="font-bold">{profile._count.following}</span> following
                 </div>
             </div>

             <div className="text-center md:text-left">
                 <div className="font-bold">{profile.name}</div>
                 <div className="whitespace-pre-wrap text-sm">{profile.bio}</div>
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200">
          <button className="flex items-center gap-2 p-3 border-t border-black -mt-[1px] text-xs font-semibold tracking-widest text-black">
              <Grid size={12} /> POSTS
          </button>
          {profile.isCurrentUser && (
              <button className="flex items-center gap-2 p-3 text-gray-500 text-xs font-semibold tracking-widest">
                <Bookmark size={12} /> SAVED
              </button>
          )}
           <button className="flex items-center gap-2 p-3 text-gray-500 text-xs font-semibold tracking-widest">
              <UserIcon size={12} /> TAGGED
          </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 p-1 md:p-4">
          {profile.posts.map(post => (
              <div key={post.id} className="relative aspect-square bg-gray-100 group cursor-pointer">
                  <Image 
                    src={post.imageUrl} 
                    alt="Post" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white font-bold">
                       {/* Overlay info like likes count could go here */}
                  </div>
              </div>
          ))}
      </div>
    </div>
  )
}
