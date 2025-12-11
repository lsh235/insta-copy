import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demo_user',
      password: hashedPassword,
      name: 'Demo User',
      bio: 'Hello! I love photography 📸',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      username: 'john_doe',
      password: hashedPassword,
      name: 'John Doe',
      bio: 'Travel enthusiast 🌍',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      username: 'jane_smith',
      password: hashedPassword,
      name: 'Jane Smith',
      bio: 'Food lover 🍕',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    },
  })

  console.log('✅ Created users:', user1.username, user2.username, user3.username)

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      caption: 'Beautiful sunset 🌅 #nature #photography',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      caption: 'Coffee time ☕️ #coffee #morning',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      authorId: user2.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      caption: 'Amazing view from the top! 🏔️',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      authorId: user3.id,
    },
  })

  const post4 = await prisma.post.create({
    data: {
      caption: 'Delicious homemade pizza 🍕',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      authorId: user3.id,
    },
  })

  const post5 = await prisma.post.create({
    data: {
      caption: 'Beach day 🏖️ #summer #beach',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      authorId: user1.id,
    },
  })

  console.log('✅ Created posts')

  // Create follows (skip if already exist)
  try {
    await prisma.follow.createMany({
      data: [
        { followerId: user1.id, followingId: user2.id },
        { followerId: user1.id, followingId: user3.id },
        { followerId: user2.id, followingId: user1.id },
        { followerId: user3.id, followingId: user2.id },
      ],
    })
    console.log('✅ Created follow relationships')
  } catch (e) {
    console.log('⚠️  Follow relationships already exist')
  }

  // Create some likes (skip if already exist)
  try {
    await prisma.like.createMany({
      data: [
        { userId: user1.id, postId: post2.id },
        { userId: user2.id, postId: post1.id },
        { userId: user3.id, postId: post5.id },
      ],
    })
    console.log('✅ Created likes')
  } catch (e) {
    console.log('⚠️  Likes already exist')
  }

  // Create some comments (skip if already exist)
  try {
    await prisma.comment.createMany({
      data: [
        { text: 'Amazing shot! 📸', authorId: user2.id, postId: post1.id },
        { text: 'Love this! ❤️', authorId: user3.id, postId: post2.id },
        { text: 'Stunning view!', authorId: user1.id, postId: post3.id },
      ],
    })
    console.log('✅ Created comments')
  } catch (e) {
    console.log('⚠️  Comments already exist')
  }

  console.log('✅ Created comments')
  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Test accounts:')
  console.log('   Email: demo@example.com, Password: password123')
  console.log('   Email: john@example.com, Password: password123')
  console.log('   Email: jane@example.com, Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
