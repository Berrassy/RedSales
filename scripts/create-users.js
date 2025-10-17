const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('🔐 Creating users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Sketch7777', 12);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@sketch.ma' },
      update: {},
      create: {
        email: 'admin@sketch.ma',
        name: 'Admin Sketch',
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin user created:', {
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    });

    // Create normal user
    const normalUser = await prisma.user.upsert({
      where: { email: 'user@sketch.ma' },
      update: {},
      create: {
        email: 'user@sketch.ma',
        name: 'Test User',
        role: 'CLIENT',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Normal user created:', {
      email: normalUser.email,
      name: normalUser.name,
      role: normalUser.role,
    });

    console.log('\n📋 User Credentials:');
    console.log('Admin User:');
    console.log('  Email: admin@sketch.ma');
    console.log('  Password: Sketch7777');
    console.log('  Role: ADMIN');
    console.log('\nNormal User:');
    console.log('  Email: user@sketch.ma');
    console.log('  Password: (Use Google OAuth)');
    console.log('  Role: CLIENT');

    console.log('\n🔑 Note: These users are created for Google OAuth authentication.');
    console.log('To sign in, use the Google OAuth button on the sign-in page.');

  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
