import { API_CONFIG, IMAGE_CONFIG } from './config';
import { prisma } from './prisma';

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  stock: number;
  isFeatured?: boolean;
  isAlmostSoldOut?: boolean;
  category: string;
  description: string;
  availableCities: string[];
  primaryCity: string;
}

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
}

// Function to get the correct category based on API data
function getCorrectCategory(apiCategory: string): string {
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
}

// Generate a placeholder image URL based on product category
function getImageUrl(category: string, productName: string) {
  const correctCategory = getCorrectCategory(category);
  
  // Check if we have a specific image for this category
  const categoryKey = Object.keys(IMAGE_CONFIG.CATEGORY_IMAGES).find(key => 
    correctCategory.toUpperCase().includes(key)
  );
  
  if (categoryKey) {
    return IMAGE_CONFIG.CATEGORY_IMAGES[categoryKey as keyof typeof IMAGE_CONFIG.CATEGORY_IMAGES];
  }
  
  // Default placeholder image
  return IMAGE_CONFIG.PLACEHOLDER_URL;
}

// Function to transform API product to our Product interface
function transformApiProduct(apiProduct: ApiProduct): Product {
  // Calculate original price (assuming 50% discount for Black Friday)
  const originalPrice = Math.round(apiProduct["Prix Promo"] * 2);
  const discountedPrice = apiProduct["Prix Promo"];
  const discountPercentage = 50;

  // Determine if product is featured (high sales or low stock)
  const isFeatured = apiProduct["Total Sales"] > 10 || apiProduct["Total Stock"] < 5;
  
  // Determine if almost sold out (low stock)
  const isAlmostSoldOut = apiProduct["Total Stock"] < 3;

  // Get available cities based on stock
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

  const { availableCities, primaryCity } = getAvailableCities(apiProduct);

  return {
    id: apiProduct["Ref. produit"],
    name: apiProduct["Libellé"],
    originalPrice,
    discountedPrice,
    discountPercentage,
    image: getImageUrl(apiProduct["Catégorie"], apiProduct["Libellé"]),
    stock: apiProduct["Total Stock"],
    isFeatured,
    isAlmostSoldOut,
    category: getCorrectCategory(apiProduct["Catégorie"]), // Use correct category mapping
    description: `${apiProduct["Libellé"]} - ${apiProduct["Catégorie"]}`,
    availableCities,
    primaryCity
  };
}

// Function to transform database product to our Product interface
function transformDbProduct(dbProduct: any): Product {
  return {
    id: dbProduct.refProduit,
    name: dbProduct.libelle,
    originalPrice: dbProduct.originalPrice,
    discountedPrice: dbProduct.prixPromo,
    discountPercentage: dbProduct.discountPercentage,
    image: getImageUrl(dbProduct.categorie, dbProduct.libelle),
    stock: dbProduct.totalStock,
    isFeatured: dbProduct.isFeatured,
    isAlmostSoldOut: dbProduct.isAlmostSoldOut,
    category: getCorrectCategory(dbProduct.categorie), // Use correct category mapping
    description: dbProduct.description || `${dbProduct.libelle} - ${dbProduct.categorie}`,
    availableCities: dbProduct.availableCities,
    primaryCity: dbProduct.primaryCity
  };
}

// Function to fetch products from database
export async function fetchBlackFridayProducts(): Promise<Product[]> {
  try {
    console.log('📦 Fetching products from database...');
    
    const dbProducts = await prisma.product.findMany({
      where: {
        totalStock: {
          gt: 0 // Only products with stock
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to 50 products for performance
    });
    
    console.log(`✅ Found ${dbProducts.length} products in database`);
    
    // Transform database products to our format
    const products = dbProducts.map(transformDbProduct);
    
    return products;
  } catch (error) {
    console.error('Error fetching products from database:', error);
    // Return fallback static products if database fails
    return getFallbackProducts();
  }
}

// Fallback static products (your original data)
function getFallbackProducts(): Product[] {
  return [
    {
      id: "1",
      name: "Canapé d'angle moderne en cuir",
      originalPrice: 8999,
      discountedPrice: 4499,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop&q=80",
      stock: 3,
      isFeatured: true,
      isAlmostSoldOut: true,
      category: "Canapés",
      description: "Canapé d'angle premium en cuir véritable",
      availableCities: ["Casa", "Rabat"],
      primaryCity: "Casa"
    },
    {
      id: "2",
      name: "Table basse marocaine sculptée",
      originalPrice: 1299,
      discountedPrice: 649,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop&q=80",
      stock: 8,
      isFeatured: false,
      isAlmostSoldOut: false,
      category: "Tables",
      description: "Table basse artisanale en bois sculpté",
      availableCities: ["Frimoda", "Marrakech", "Tanger"],
      primaryCity: "Frimoda"
    },
    {
      id: "3",
      name: "Lit king size en bois massif",
      originalPrice: 5999,
      discountedPrice: 2999,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=400&fit=crop&q=80",
      stock: 2,
      isFeatured: false,
      isAlmostSoldOut: true,
      category: "Chambre",
      description: "Lit king size en bois massif de qualité supérieure",
      availableCities: ["Rabat"],
      primaryCity: "Rabat"
    },
    {
      id: "4",
      name: "Ensemble salon 7 places",
      originalPrice: 12999,
      discountedPrice: 6499,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop&q=80",
      stock: 1,
      isFeatured: true,
      isAlmostSoldOut: true,
      category: "Salons",
      description: "Ensemble salon complet 7 places",
      availableCities: ["Casa"],
      primaryCity: "Casa"
    },
    {
      id: "5",
      name: "Fauteuil club en cuir",
      originalPrice: 2999,
      discountedPrice: 1499,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop&q=80",
      stock: 12,
      isFeatured: false,
      isAlmostSoldOut: false,
      category: "Canapés",
      description: "Fauteuil club confortable en cuir",
      availableCities: ["Frimoda", "Casa", "Rabat", "Marrakech", "Tanger"],
      primaryCity: "Frimoda"
    },
    {
      id: "6",
      name: "Table à manger 8 personnes",
      originalPrice: 3999,
      discountedPrice: 1999,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop&q=80",
      stock: 5,
      isFeatured: false,
      isAlmostSoldOut: false,
      category: "Tables",
      description: "Table à manger extensible 8 personnes",
      availableCities: ["Frimoda", "Casa", "Bouskoura"],
      primaryCity: "Frimoda"
    },
    {
      id: "7",
      name: "Armoire 3 portes en bois",
      originalPrice: 2499,
      discountedPrice: 1249,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=400&fit=crop&q=80",
      stock: 4,
      isFeatured: false,
      isAlmostSoldOut: false,
      category: "Meubles",
      description: "Armoire 3 portes avec miroir",
      availableCities: ["Rabat", "Marrakech"],
      primaryCity: "Rabat"
    },
    {
      id: "8",
      name: "Ensemble jardin 6 places",
      originalPrice: 4999,
      discountedPrice: 2499,
      discountPercentage: 50,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop&q=80",
      stock: 2,
      isFeatured: true,
      isAlmostSoldOut: true,
      category: "Jardin",
      description: "Ensemble jardin résistant aux intempéries",
      availableCities: ["Marrakech", "Tanger"],
      primaryCity: "Marrakech"
    }
  ];
}

// Legacy export for backward compatibility
export const blackFridayProducts: Product[] = getFallbackProducts();
