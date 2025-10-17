const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to get the correct category based on API data
const getCorrectCategory = (apiCategory) => {
  const category = apiCategory.toLowerCase();
  
  // Salon categories
  if (category.includes('salon') || category.includes('canapé')) {
    return 'Salons';
  }
  
  // Canapé categories
  if (category.includes('canapé 3 places') || category.includes('canapé 4 places')) {
    return 'Canapés';
  }
  
  // Table categories
  if (category.includes('table basse') || category.includes('table de salle à manger') || category.includes('table d\'appoint') || category.includes('table de chevet')) {
    return 'Tables';
  }
  
  // Lit categories
  if (category.includes('lit')) {
    return 'Chambre';
  }
  
  // Matelas categories
  if (category.includes('matelas')) {
    return 'Chambre';
  }
  
  // Fauteuil categories
  if (category.includes('fauteuil')) {
    return 'Canapés';
  }
  
  // Jardin/Extérieur categories
  if (category.includes('jardin') || category.includes('exterieur') || category.includes('ensemble d\'exterieur') || category.includes('transat')) {
    return 'Jardin';
  }
  
  // Chaise categories
  if (category.includes('chaise')) {
    return 'Chaises';
  }
  
  // Coussins categories
  if (category.includes('coussins')) {
    return 'Déco';
  }
  
  // Default fallback
  return 'Meubles';
};

// Function to get available cities based on stock
const getAvailableCities = (apiProduct) => {
  const cities = [
    { name: "Frimoda", stock: apiProduct["Stock Frimoda"] },
    { name: "Casa", stock: apiProduct["Stock Casa"] },
    { name: "Rabat", stock: apiProduct["Stock Rabat"] },
    { name: "Marrakech", stock: apiProduct["Stock Marrakech"] },
    { name: "Tanger", stock: apiProduct["Stock Tanger"] },
    { name: "Bouskoura", stock: apiProduct["Stock Bouskoura"] },
    { name: "Warehouse57", stock: apiProduct["Stock Warehouse57"] }
  ];

  const availableCities = cities
    .filter(city => city.stock > 0)
    .map(city => city.name);

  // Primary city is the one with the most stock
  const primaryCity = cities
    .filter(city => city.stock > 0)
    .sort((a, b) => b.stock - a.stock)[0]?.name || "Frimoda";

  return { availableCities, primaryCity };
};

async function syncApiToDatabase() {
  try {
    console.log('🔄 Starting API to Database sync...');
    
    // Fetch data from API
    const apiUrl = "https://ratio.sketchdesign.ma/ratio/fetch_products_new.php?type=category&query=Warehouse57-Temp&dateRange=4";
    console.log('📡 Fetching data from API...');
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiProducts = await response.json();
    console.log(`📦 Fetched ${apiProducts.length} products from API`);
    
    // Clear existing products
    console.log('🗑️ Clearing existing products...');
    await prisma.product.deleteMany({});
    console.log('✅ Existing products cleared');
    
    let syncedCount = 0;
    let errorCount = 0;
    
    // Process each product
    for (const apiProduct of apiProducts) {
      try {
        // Calculate derived fields
        const originalPrice = Math.round(apiProduct["Prix Promo"] * 2);
        const discountPercentage = 50;
        const isFeatured = apiProduct["Total Sales"] > 10 || apiProduct["Total Stock"] < 5;
        const isAlmostSoldOut = apiProduct["Total Stock"] < 3;
        const correctCategory = getCorrectCategory(apiProduct["Catégorie"]);
        const { availableCities, primaryCity } = getAvailableCities(apiProduct);
        
        // Create product in database
        await prisma.product.create({
          data: {
            refProduit: apiProduct["Ref. produit"],
            libelle: apiProduct["Libellé"],
            categorie: correctCategory,
            prixPromo: apiProduct["Prix Promo"],
            originalPrice,
            discountPercentage,
            totalStock: apiProduct["Total Stock"],
            totalSales: apiProduct["Total Sales"],
            totalSalesValue: apiProduct["TotalSalesValue"],
            ratioSKE: String(apiProduct["Ratio SKE"]),
            ratioTotal: String(apiProduct["Ratio Total"]),
            isFeatured,
            isAlmostSoldOut,
            stockFrimoda: apiProduct["Stock Frimoda"],
            stockCasa: apiProduct["Stock Casa"],
            stockRabat: apiProduct["Stock Rabat"],
            stockMarrakech: apiProduct["Stock Marrakech"],
            stockTanger: apiProduct["Stock Tanger"],
            stockBouskoura: apiProduct["Stock Bouskoura"],
            stockWarehouse57: apiProduct["Stock Warehouse57"],
            availableCities,
            primaryCity,
            description: `${apiProduct["Libellé"]} - ${apiProduct["Catégorie"]}`
          }
        });
        
        syncedCount++;
        
        if (syncedCount % 10 === 0) {
          console.log(`📊 Processed ${syncedCount} products...`);
        }
        
      } catch (productError) {
        console.error(`❌ Error processing product ${apiProduct["Ref. produit"]}:`, productError.message);
        errorCount++;
      }
    }
    
    // Record sync in database
    await prisma.apiSync.create({
      data: {
        lastSync: new Date(),
        totalProducts: syncedCount,
        success: true
      }
    });
    
    console.log(`✅ Sync completed successfully!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Products synced: ${syncedCount}`);
    console.log(`   - Errors: ${errorCount}`);
    console.log(`   - Success rate: ${((syncedCount / apiProducts.length) * 100).toFixed(1)}%`);
    
    // Show some sample data
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      select: {
        refProduit: true,
        libelle: true,
        categorie: true,
        prixPromo: true,
        totalStock: true,
        primaryCity: true
      }
    });
    
    console.log('\n📋 Sample products in database:');
    sampleProducts.forEach(product => {
      console.log(`   - ${product.refProduit}: ${product.libelle} (${product.categorie}) - ${product.prixPromo} MAD - Stock: ${product.totalStock} - City: ${product.primaryCity}`);
    });
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    
    // Record failed sync
    await prisma.apiSync.create({
      data: {
        lastSync: new Date(),
        totalProducts: 0,
        success: false,
        errorMessage: error.message
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

syncApiToDatabase();
