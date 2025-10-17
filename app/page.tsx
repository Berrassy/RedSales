import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import { fetchBlackFridayProducts } from "@/lib/products";

export default async function Home() {
  const blackFridayProducts = await fetchBlackFridayProducts();
  const featuredProducts = blackFridayProducts.filter(p => p.isFeatured);
  const almostSoldOutProducts = blackFridayProducts.filter(p => p.isAlmostSoldOut);

  return (
    <>
      <Navbar />
      <HomePage 
        blackFridayProducts={blackFridayProducts}
        featuredProducts={featuredProducts}
        almostSoldOutProducts={almostSoldOutProducts}
      />
    </>
  );
}

