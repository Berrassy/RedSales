const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyUsers() {
  try {
    console.log('🔍 Verifying users in database...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`📊 Found ${users.length} users in database:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Check for admin user
    const adminUser = users.find(user => user.role === 'ADMIN');
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.email);
    } else {
      console.log('❌ No admin user found');
    }

    // Check for client users
    const clientUsers = users.filter(user => user.role === 'CLIENT');
    console.log(`✅ Found ${clientUsers.length} client user(s)`);

    console.log('\n🔑 Login Instructions:');
    console.log('Admin User:');
    console.log('  - Email: admin@sketch.ma');
    console.log('  - Password: Sketch7777');
    console.log('  - Use the email/password form on the sign-in page');
    console.log('');
    console.log('Client User:');
    console.log('  - Email: user@sketch.ma');
    console.log('  - Use Google OAuth (recommended)');
    console.log('  - Or create a new account with Google OAuth');

  } catch (error) {
    console.error('❌ Error verifying users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUsers();
