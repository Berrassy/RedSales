const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test basic query
    const productCount = await prisma.product.count();
    console.log(`📦 Products in database: ${productCount}`);
    
    // Test basic database operations
    console.log('🔄 Testing database operations...');
    
    // Create a test product
    const testProduct = await prisma.product.create({
      data: {
        refProduit: 'TEST-001',
        libelle: 'Test Product',
        categorie: 'Test',
        prixPromo: 100,
        originalPrice: 200,
        discountPercentage: 50,
        totalStock: 10,
        totalSales: 0,
        totalSalesValue: 0,
        ratioSKE: '0',
        ratioTotal: '0',
        isFeatured: false,
        isAlmostSoldOut: false,
        stockFrimoda: 5,
        stockCasa: 3,
        stockRabat: 2,
        stockMarrakech: 0,
        stockTanger: 0,
        stockBouskoura: 0,
        stockWarehouse57: 0,
        availableCities: ['Frimoda', 'Casa', 'Rabat'],
        primaryCity: 'Frimoda',
        description: 'Test product for database verification'
      }
    });
    
    console.log('✅ Test product created successfully!');
    
    // Clean up test product
    await prisma.product.delete({
      where: { id: testProduct.id }
    });
    
    console.log('✅ Test product cleaned up successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
