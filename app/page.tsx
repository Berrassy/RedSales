import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4 text-white">Bienvenue chez Sketch Design Maroc</h1>
        <p className="text-gray-400 text-lg">
          Découvrez notre collection exclusive de mobilier marocain de luxe.
        </p>
      </div>
    </main>
  );
}

