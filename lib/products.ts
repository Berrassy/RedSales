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
}

export const blackFridayProducts: Product[] = [
  {
    id: "1",
    name: "Canapé d'angle moderne en cuir",
    originalPrice: 8999,
    discountedPrice: 4499,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 3,
    isFeatured: true,
    isAlmostSoldOut: true,
    category: "Canapés",
    description: "Canapé d'angle premium en cuir véritable"
  },
  {
    id: "2",
    name: "Table basse marocaine sculptée",
    originalPrice: 1299,
    discountedPrice: 649,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 8,
    isFeatured: false,
    isAlmostSoldOut: false,
    category: "Tables",
    description: "Table basse artisanale en bois sculpté"
  },
  {
    id: "3",
    name: "Lit king size en bois massif",
    originalPrice: 5999,
    discountedPrice: 2999,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 2,
    isFeatured: false,
    isAlmostSoldOut: true,
    category: "Chambre",
    description: "Lit king size en bois massif de qualité supérieure"
  },
  {
    id: "4",
    name: "Ensemble salon 7 places",
    originalPrice: 12999,
    discountedPrice: 6499,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 1,
    isFeatured: true,
    isAlmostSoldOut: true,
    category: "Salons",
    description: "Ensemble salon complet 7 places"
  },
  {
    id: "5",
    name: "Fauteuil club en cuir",
    originalPrice: 2999,
    discountedPrice: 1499,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 12,
    isFeatured: false,
    isAlmostSoldOut: false,
    category: "Canapés",
    description: "Fauteuil club confortable en cuir"
  },
  {
    id: "6",
    name: "Table à manger 8 personnes",
    originalPrice: 3999,
    discountedPrice: 1999,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 5,
    isFeatured: false,
    isAlmostSoldOut: false,
    category: "Tables",
    description: "Table à manger extensible 8 personnes"
  },
  {
    id: "7",
    name: "Armoire 3 portes en bois",
    originalPrice: 2499,
    discountedPrice: 1249,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 4,
    isFeatured: false,
    isAlmostSoldOut: false,
    category: "Meubles",
    description: "Armoire 3 portes avec miroir"
  },
  {
    id: "8",
    name: "Ensemble jardin 6 places",
    originalPrice: 4999,
    discountedPrice: 2499,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    stock: 2,
    isFeatured: true,
    isAlmostSoldOut: true,
    category: "Jardin",
    description: "Ensemble jardin résistant aux intempéries"
  }
];
