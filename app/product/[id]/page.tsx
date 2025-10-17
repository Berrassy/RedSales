import { notFound } from "next/navigation";
import { blackFridayProducts } from "@/lib/products";
import ProductDetailsPage from "@/components/ProductDetailsPage";
import Navbar from "@/components/Navbar";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = blackFridayProducts.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailsPage product={product} />
    </>
  );
}

// Generate static params for all products
export async function generateStaticParams() {
  return blackFridayProducts.map((product) => ({
    id: product.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = blackFridayProducts.find(p => p.id === id);
  
  if (!product) {
    return {
      title: "Produit non trouvé",
    };
  }

  return {
    title: `${product.name} - Black Friday | Sketch Design Maroc`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Black Friday`,
      description: product.description,
      images: [product.image],
    },
  };
}
