import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.product.findMany({
      select: {
        categorie: true
      },
      distinct: ['categorie'],
      where: {
        totalStock: {
          gt: 0
        }
      }
    });
    
    const categoryList = categories.map(cat => cat.categorie).filter(Boolean);
    
    return NextResponse.json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return fallback categories
    return NextResponse.json(['Salons', 'Canapés', 'Chambre', 'Tables', 'Chaises', 'Jardin', 'Meubles', 'Déco']);
  }
}
