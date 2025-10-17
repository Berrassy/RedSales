const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database status...');
    
    // Get total products count
    const totalProducts = await prisma.product.count();
    console.log(`📦 Total products in database: ${totalProducts}`);
    
    // Get products by category
    const productsByCategory = await prisma.product.groupBy({
      by: ['categorie'],
      _count: {
        categorie: true
      }
    });
    
    console.log('\n📊 Products by category:');
    productsByCategory.forEach(category => {
      console.log(`   - ${category.categorie}: ${category._count.categorie} products`);
    });
    
    // Get featured products
    const featuredCount = await prisma.product.count({
      where: { isFeatured: true }
    });
    console.log(`\n⭐ Featured products: ${featuredCount}`);
    
    // Get almost sold out products
    const almostSoldOutCount = await prisma.product.count({
      where: { isAlmostSoldOut: true }
    });
    console.log(`🔥 Almost sold out products: ${almostSoldOutCount}`);
    
    // Get products by city
    const productsByCity = await prisma.product.groupBy({
      by: ['primaryCity'],
      _count: {
        primaryCity: true
      }
    });
    
    console.log('\n🏪 Products by primary city:');
    productsByCity.forEach(city => {
      console.log(`   - ${city.primaryCity}: ${city._count.primaryCity} products`);
    });
    
    // Get latest sync info
    const latestSync = await prisma.apiSync.findFirst({
      orderBy: { lastSync: 'desc' }
    });
    
    if (latestSync) {
      console.log(`\n🔄 Latest sync: ${latestSync.lastSync.toISOString()}`);
      console.log(`   - Success: ${latestSync.success}`);
      console.log(`   - Products synced: ${latestSync.totalProducts}`);
      if (latestSync.errorMessage) {
        console.log(`   - Error: ${latestSync.errorMessage}`);
      }
    }
    
    // Show sample products
    const sampleProducts = await prisma.product.findMany({
      take: 3,
      select: {
        refProduit: true,
        libelle: true,
        categorie: true,
        prixPromo: true,
        totalStock: true,
        primaryCity: true,
        isFeatured: true
      }
    });
    
    console.log('\n📋 Sample products:');
    sampleProducts.forEach(product => {
      const featured = product.isFeatured ? ' ⭐' : '';
      console.log(`   - ${product.refProduit}: ${product.libelle}${featured}`);
      console.log(`     Category: ${product.categorie} | Price: ${product.prixPromo} MAD | Stock: ${product.totalStock} | City: ${product.primaryCity}`);
    });
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
