import { NextRequest, NextResponse } from 'next/server';
import { fetchBlackFridayProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    const products = await fetchBlackFridayProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
