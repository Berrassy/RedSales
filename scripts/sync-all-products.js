const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// API Configuration
const API_CONFIG = {
  BASE_URL: "https://ratio.sketchdesign.ma/ratio/fetch_products_new.php",
  ENDPOINTS: [
    {
      name: "Warehouse57-Temp",
      url: "https://ratio.sketchdesign.ma/ratio/fetch_products_new.php?type=category&query=Warehouse57-Temp&dateRange=4"
    },
    {
      name: "All Products",
      url: "https://ratio.sketchdesign.ma/ratio/fetch_products_new.php?type=all&dateRange=30"
    },
    {
      name: "Featured Products",
      url: "https://ratio.sketchdesign.ma/ratio/fetch_products_new.php?type=featured&dateRange=7"
    }
  ]
};

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
    { name: "Frimoda", stock: apiProduct["Stock Frimoda"] || 0 },
    { name: "Casa", stock: apiProduct["Stock Casa"] || 0 },
    { name: "Rabat", stock: apiProduct["Stock Rabat"] || 0 },
    { name: "Marrakech", stock: apiProduct["Stock Marrakech"] || 0 },
    { name: "Tanger", stock: apiProduct["Stock Tanger"] || 0 },
    { name: "Bouskoura", stock: apiProduct["Stock Bouskoura"] || 0 },
    { name: "Warehouse57", stock: apiProduct["Stock Warehouse57"] || 0 }
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

// Function to fetch data from a specific endpoint
async function fetchFromEndpoint(endpoint) {
  try {
    console.log(`📡 Fetching data from ${endpoint.name}...`);
    console.log(`🔗 URL: ${endpoint.url}`);
    
    const response = await fetch(endpoint.url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`📦 Fetched ${data.length} products from ${endpoint.name}`);
    
    return data;
  } catch (error) {
    console.error(`❌ Error fetching from ${endpoint.name}:`, error.message);
    return [];
  }
}

// Function to process and save products
async function processProducts(apiProducts, source) {
  let syncedCount = 0;
  let errorCount = 0;
  const processedRefs = new Set();

  for (const apiProduct of apiProducts) {
    try {
      const refProduit = apiProduct["Ref. produit"];
      
      // Skip if we've already processed this product
      if (processedRefs.has(refProduit)) {
        continue;
      }
      processedRefs.add(refProduit);

      // Calculate derived fields
      const originalPrice = Math.round(apiProduct["Prix Promo"] * 2);
      const discountPercentage = 50;
      const isFeatured = apiProduct["Total Sales"] > 10 || apiProduct["Total Stock"] < 5;
      const isAlmostSoldOut = apiProduct["Total Stock"] < 3;
      const correctCategory = getCorrectCategory(apiProduct["Catégorie"]);
      const { availableCities, primaryCity } = getAvailableCities(apiProduct);
      
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { refProduit }
      });

      const productData = {
        refProduit,
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
        stockFrimoda: apiProduct["Stock Frimoda"] || 0,
        stockCasa: apiProduct["Stock Casa"] || 0,
        stockRabat: apiProduct["Stock Rabat"] || 0,
        stockMarrakech: apiProduct["Stock Marrakech"] || 0,
        stockTanger: apiProduct["Stock Tanger"] || 0,
        stockBouskoura: apiProduct["Stock Bouskoura"] || 0,
        stockWarehouse57: apiProduct["Stock Warehouse57"] || 0,
        availableCities,
        primaryCity,
        description: `${apiProduct["Libellé"]} - ${apiProduct["Catégorie"]}`
      };

      if (existingProduct) {
        // Update existing product
        await prisma.product.update({
          where: { refProduit },
          data: productData
        });
      } else {
        // Create new product
        await prisma.product.create({
          data: productData
        });
      }
      
      syncedCount++;
      
      if (syncedCount % 10 === 0) {
        console.log(`📊 Processed ${syncedCount} products from ${source}...`);
      }
      
    } catch (productError) {
      console.error(`❌ Error processing product ${apiProduct["Ref. produit"]}:`, productError.message);
      errorCount++;
    }
  }

  return { syncedCount, errorCount };
}

async function syncAllProducts() {
  try {
    console.log('🔄 Starting comprehensive API to Database sync...');
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    
    let totalSynced = 0;
    let totalErrors = 0;
    const allProducts = [];

    // Fetch from all endpoints
    for (const endpoint of API_CONFIG.ENDPOINTS) {
      const products = await fetchFromEndpoint(endpoint);
      if (products.length > 0) {
        allProducts.push(...products);
        console.log(`✅ Successfully fetched ${products.length} products from ${endpoint.name}`);
      }
    }

    if (allProducts.length === 0) {
      throw new Error('No products fetched from any endpoint');
    }

    console.log(`📦 Total unique products to process: ${allProducts.length}`);
    
    // Process all products
    const { syncedCount, errorCount } = await processProducts(allProducts, 'All Endpoints');
    totalSynced += syncedCount;
    totalErrors += errorCount;
    
    // Record sync in database
    await prisma.apiSync.create({
      data: {
        lastSync: new Date(),
        totalProducts: totalSynced,
        success: true
      }
    });
    
    console.log(`\n✅ Comprehensive sync completed successfully!`);
    console.log(`📊 Final Statistics:`);
    console.log(`   - Products synced: ${totalSynced}`);
    console.log(`   - Errors: ${totalErrors}`);
    console.log(`   - Success rate: ${((totalSynced / allProducts.length) * 100).toFixed(1)}%`);
    console.log(`📅 Completed at: ${new Date().toISOString()}`);
    
    // Show some sample data
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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
    
    console.log('\n📋 Latest products in database:');
    sampleProducts.forEach(product => {
      const featured = product.isFeatured ? ' ⭐' : '';
      console.log(`   - ${product.refProduit}: ${product.libelle}${featured}`);
      console.log(`     Category: ${product.categorie} | Price: ${product.prixPromo} MAD | Stock: ${product.totalStock} | City: ${product.primaryCity}`);
    });
    
  } catch (error) {
    console.error('❌ Comprehensive sync failed:', error);
    
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

// Run the sync
syncAllProducts();
