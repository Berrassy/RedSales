import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

// Function to transform database product to our Product interface
function transformDbProduct(dbProduct: any) {
  return {
    id: dbProduct.refProduit,
    name: dbProduct.libelle,
    originalPrice: dbProduct.originalPrice,
    discountedPrice: dbProduct.prixPromo,
    discountPercentage: dbProduct.discountPercentage,
    image: dbProduct.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop&q=80',
    stock: dbProduct.totalStock,
    isFeatured: dbProduct.isFeatured,
    isAlmostSoldOut: dbProduct.isAlmostSoldOut,
    category: getCorrectCategory(dbProduct.categorie),
    description: dbProduct.description || `${dbProduct.libelle} - ${dbProduct.categorie}`,
    dimensions: dbProduct.dimensions || null,
    availableCities: dbProduct.availableCities,
    primaryCity: dbProduct.primaryCity
  };
}

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;
    
    const dbProducts = await prisma.product.findMany({
      where: {
        categorie: category,
        totalStock: {
          gt: 0
        }
      },
      orderBy: {
        isFeatured: 'desc'
      },
      take: 8 // Limit to 8 products per category for navbar
    });
    
    const products = dbProducts.map(transformDbProduct);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error(`Error fetching products for category ${params.category}:`, error);
    return NextResponse.json([]);
  }
}
