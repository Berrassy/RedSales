import { prisma } from './prisma'
import { API_CONFIG } from './config'

// API Response interface
export interface ApiProduct {
  "Catégorie": string;
  "Ref. produit": string;
  "Libellé": string;
  "Prix Promo": number;
  "Total Stock": number;
  "Stock Frimoda": number;
  "Stock Casa": number;
  "Stock Rabat": number;
  "Stock Marrakech": number;
  "Stock Tanger": number;
  "Stock Bouskoura": number;
  "Stock Warehouse57": number;
  "Total Sales": number;
  "Ratio SKE": number | string;
  "Ratio Total": number | string;
  "TotalSalesValue": number;
  "Dimensions"?: string;
}

// Function to get the correct category based on API data
const getCorrectCategory = (apiCategory: string): string => {
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
const getAvailableCities = (apiProduct: ApiProduct): { availableCities: string[], primaryCity: string } => {
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

// Function to extract dimensions from product name (libellé)
function extractDimensionsFromLibelle(libelle: string): string | null {
  if (!libelle) return null;
  
  // Common dimension patterns in French furniture names
  const dimensionPatterns = [
    // Pattern: "L x l x H cm" or "L x l x H"
    /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(?:cm)?/i,
    // Pattern: "L x l cm" or "L x l"
    /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(?:cm)?/i,
    // Pattern: "L cm" or "L"
    /(\d+(?:\.\d+)?)\s*(?:cm)?/i,
    // Pattern: "L x l x H mm" or "L x l x H"
    /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(?:mm)?/i,
    // Pattern: "L x l mm" or "L x l"
    /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(?:mm)?/i,
  ];
  
  for (const pattern of dimensionPatterns) {
    const match = libelle.match(pattern);
    if (match) {
      if (match.length === 4) {
        // Three dimensions: L x l x H
        return `${match[1]} x ${match[2]} x ${match[3]} cm`;
      } else if (match.length === 3) {
        // Two dimensions: L x l
        return `${match[1]} x ${match[2]} cm`;
      } else if (match.length === 2) {
        // One dimension: L
        return `${match[1]} cm`;
      }
    }
  }
  
  // If no pattern matches, try to extract any numbers that might be dimensions
  const numberPattern = /(\d+(?:\.\d+)?)\s*(?:x\s*(\d+(?:\.\d+)?))?\s*(?:x\s*(\d+(?:\.\d+)?))?/i;
  const numberMatch = libelle.match(numberPattern);
  if (numberMatch) {
    if (numberMatch[3]) {
      return `${numberMatch[1]} x ${numberMatch[2]} x ${numberMatch[3]} cm`;
    } else if (numberMatch[2]) {
      return `${numberMatch[1]} x ${numberMatch[2]} cm`;
    } else {
      return `${numberMatch[1]} cm`;
    }
  }
  
  return null;
}

// Function to sync products from API to database
export async function syncProductsFromAPI(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log('🔄 Starting API sync...');
    
    // Fetch data from API
    const response = await fetch(API_CONFIG.FULL_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiProducts: ApiProduct[] = await response.json();
    console.log(`📦 Fetched ${apiProducts.length} products from API`);
    
    let syncedCount = 0;
    
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
        const extractedDimensions = extractDimensionsFromLibelle(apiProduct["Libellé"]);
        
        // Upsert product (update if exists, create if not)
        await prisma.product.upsert({
          where: { refProduit: apiProduct["Ref. produit"] },
          update: {
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
            description: `${apiProduct["Libellé"]} - ${apiProduct["Catégorie"]}`,
            dimensions: apiProduct["Dimensions"] || extractedDimensions,
            updatedAt: new Date()
          },
          create: {
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
            description: `${apiProduct["Libellé"]} - ${apiProduct["Catégorie"]}`,
            dimensions: apiProduct["Dimensions"] || extractedDimensions
          }
        });
        
        syncedCount++;
      } catch (productError) {
        console.error(`❌ Error processing product ${apiProduct["Ref. produit"]}:`, productError);
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
    
    console.log(`✅ Successfully synced ${syncedCount} products`);
    
    return { success: true, count: syncedCount };
    
  } catch (error) {
    console.error('❌ API sync failed:', error);
    
    // Record failed sync
    await prisma.apiSync.create({
      data: {
        lastSync: new Date(),
        totalProducts: 0,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Function to get products from database
export async function getProductsFromDB() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

// Function to get featured products
export async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' }
  });
}

// Function to get almost sold out products
export async function getAlmostSoldOutProducts() {
  return await prisma.product.findMany({
    where: { isAlmostSoldOut: true },
    orderBy: { createdAt: 'desc' }
  });
}

// Function to test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
