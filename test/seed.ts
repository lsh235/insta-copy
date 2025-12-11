import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Starting TEST database seed...')

  // Create test users
  const hashedPassword = await bcrypt.hash('test123', 10)

  const testUser1 = await prisma.user.upsert({
    where: { email: 'test1@test.com' },
    update: {},
    create: {
      email: 'test1@test.com',
      username: 'test_user_1',
      password: hashedPassword,
      name: 'Test User 1',
      bio: 'Test account for debugging 🧪',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test1',
    },
  })

  const testUser2 = await prisma.user.upsert({
    where: { email: 'test2@test.com' },
    update: {},
    create: {
      email: 'test2@test.com',
      username: 'test_user_2',
      password: hashedPassword,
      name: 'Test User 2',
      bio: 'Another test account 🔬',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test2',
    },
  })

  const testUser3 = await prisma.user.upsert({
    where: { email: 'test3@test.com' },
    update: {},
    create: {
      email: 'test3@test.com',
      username: 'test_user_3',
      password: hashedPassword,
      name: 'Test User 3',
      bio: 'Testing everything 🚀',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test3',
    },
  })

  console.log('✅ Created test users:', testUser1.username, testUser2.username, testUser3.username)

  // Create test posts
  const testPost1 = await prisma.post.create({
    data: {
      caption: '[TEST] Sample post 1 - Nature 🌲',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      authorId: testUser1.id,
    },
  })

  const testPost2 = await prisma.post.create({
    data: {
      caption: '[TEST] Sample post 2 - Technology 💻',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      authorId: testUser2.id,
    },
  })

  const testPost3 = await prisma.post.create({
    data: {
      caption: '[TEST] Sample post 3 - City lights 🌃',
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
      authorId: testUser3.id,
    },
  })

  const testPost4 = await prisma.post.create({
    data: {
      caption: '[TEST] Sample post 4 - Testing features ⚡',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      authorId: testUser1.id,
    },
  })

  const testPost5 = await prisma.post.create({
    data: {
      caption: '[TEST] Sample post 5 - Debug mode 🐛',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
      authorId: testUser2.id,
    },
  })

  const testPost6 = await prisma.post.create({
    data: {
      caption: '[TEST] Sample post 6 - Architecture 🏛️',
      imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80',
      authorId: testUser3.id,
    },
  })

  console.log('✅ Created test posts (6 total)')

  // Create follow relationships
  await prisma.follow.create({
    data: {
      followerId: testUser1.id,
      followingId: testUser2.id,
    },
  })

  await prisma.follow.create({
    data: {
      followerId: testUser1.id,
      followingId: testUser3.id,
    },
  })

  await prisma.follow.create({
    data: {
      followerId: testUser2.id,
      followingId: testUser1.id,
    },
  })

  await prisma.follow.create({
    data: {
      followerId: testUser2.id,
      followingId: testUser3.id,
    },
  })

  await prisma.follow.create({
    data: {
      followerId: testUser3.id,
      followingId: testUser1.id,
    },
  })

  console.log('✅ Created follow relationships')

  // Create test likes
  await prisma.like.create({
    data: {
      userId: testUser1.id,
      postId: testPost2.id,
    },
  })

  await prisma.like.create({
    data: {
      userId: testUser2.id,
      postId: testPost1.id,
    },
  })

  await prisma.like.create({
    data: {
      userId: testUser3.id,
      postId: testPost4.id,
    },
  })

  await prisma.like.create({
    data: {
      userId: testUser1.id,
      postId: testPost5.id,
    },
  })

  console.log('✅ Created test likes')

  // Create test comments
  await prisma.comment.create({
    data: {
      text: '[TEST] Great shot! 📸',
      authorId: testUser2.id,
      postId: testPost1.id,
    },
  })

  await prisma.comment.create({
    data: {
      text: '[TEST] Testing comments feature ✨',
      authorId: testUser3.id,
      postId: testPost2.id,
    },
  })

  await prisma.comment.create({
    data: {
      text: '[TEST] This is awesome!',
      authorId: testUser1.id,
      postId: testPost3.id,
    },
  })

  await prisma.comment.create({
    data: {
      text: '[TEST] Debug comment 🔧',
      authorId: testUser2.id,
      postId: testPost4.id,
    },
  })

  console.log('✅ Created test comments')
  console.log('🎉 TEST database seed completed successfully!')
  console.log('\n📝 Test accounts (all use password: test123):')
  console.log('   Email: test1@test.com')
  console.log('   Email: test2@test.com')
  console.log('   Email: test3@test.com')
  console.log('\n💡 Use these accounts for debugging and testing features')
}

main()
  .catch((e) => {
    console.error('❌ Test seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
