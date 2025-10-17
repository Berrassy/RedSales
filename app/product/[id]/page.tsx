import { notFound } from "next/navigation";
import { blackFridayProducts } from "@/lib/products";
import ProductDetailsPage from "@/components/ProductDetailsPage";
import Navbar from "@/components/Navbar";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = blackFridayProducts.find(p => p.id === params.id);

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
  const product = blackFridayProducts.find(p => p.id === params.id);
  
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
