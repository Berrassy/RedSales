import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}

