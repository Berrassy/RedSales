import type { Metadata } from "next";
import "./globals.css";
import { WishlistProvider } from "@/lib/wishlist-context";

export const metadata: Metadata = {
  title: "Sketch Design Maroc - Mobilier de Luxe",
  description: "Découvrez notre collection de meubles marocains de luxe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </body>
    </html>
  );
}

