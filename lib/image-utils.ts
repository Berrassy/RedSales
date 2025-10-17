// Utility functions for dynamic image generation
export interface ImageSource {
  url: string;
  alt: string;
  provider: 'unsplash' | 'pexels' | 'picsum';
}

// Generate multiple random images based on product category and name
export function generateProductImages(productName: string, category: string, count: number = 4): ImageSource[] {
  const images: ImageSource[] = [];
  
  // Create search terms based on product name and category
  const searchTerms = [
    productName.toLowerCase(),
    category.toLowerCase(),
    ...productName.toLowerCase().split(' ').filter(word => word.length > 3)
  ];
  
  // Remove duplicates and limit search terms
  const uniqueSearchTerms = [...new Set(searchTerms)].slice(0, 3);
  
  for (let i = 0; i < count; i++) {
    const searchTerm = uniqueSearchTerms[i % uniqueSearchTerms.length];
    const provider = ['unsplash', 'pexels', 'picsum'][i % 3] as 'unsplash' | 'pexels' | 'picsum';
    
    let imageUrl: string;
    let alt: string;
    
    switch (provider) {
      case 'unsplash':
        imageUrl = `https://images.unsplash.com/photo-${generateRandomPhotoId()}?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3`;
        alt = `${productName} - Image ${i + 1}`;
        break;
      case 'pexels':
        imageUrl = `https://images.pexels.com/photos/${generateRandomPexelsId()}/pexels-${generateRandomPexelsId()}-${generateRandomPexelsId()}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`;
        alt = `${productName} - Image ${i + 1}`;
        break;
      case 'picsum':
        imageUrl = `https://picsum.photos/800/600?random=${generateRandomSeed()}`;
        alt = `${productName} - Image ${i + 1}`;
        break;
    }
    
    images.push({
      url: imageUrl,
      alt,
      provider
    });
  }
  
  return images;
}

// Generate random photo ID for Unsplash
function generateRandomPhotoId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate random Pexels ID
function generateRandomPexelsId(): number {
  return Math.floor(Math.random() * 1000000) + 100000;
}

// Generate random seed for Picsum
function generateRandomSeed(): number {
  return Math.floor(Math.random() * 1000) + 1;
}

// Get category-specific search terms for better image relevance
export function getCategorySearchTerms(category: string): string[] {
  const categoryMap: Record<string, string[]> = {
    'Canapés': ['sofa', 'couch', 'living room', 'furniture'],
    'Tables': ['table', 'dining table', 'coffee table', 'furniture'],
    'Chambre': ['bedroom', 'bed', 'furniture', 'interior'],
    'Salons': ['living room', 'sofa', 'furniture', 'interior'],
    'Chaises': ['chair', 'dining chair', 'furniture'],
    'Jardin': ['garden', 'outdoor', 'patio', 'furniture'],
    'Déco': ['decoration', 'home decor', 'interior'],
    'Meubles': ['furniture', 'home', 'interior']
  };
  
  return categoryMap[category] || ['furniture', 'home', 'interior'];
}
