-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "ref_produit" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "prix_promo" DOUBLE PRECISION NOT NULL,
    "original_price" DOUBLE PRECISION NOT NULL,
    "discount_percentage" INTEGER NOT NULL,
    "total_stock" INTEGER NOT NULL,
    "total_sales" INTEGER NOT NULL,
    "total_sales_value" DOUBLE PRECISION NOT NULL,
    "ratio_ske" TEXT,
    "ratio_total" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_almost_sold_out" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stock_frimoda" INTEGER NOT NULL DEFAULT 0,
    "stock_casa" INTEGER NOT NULL DEFAULT 0,
    "stock_rabat" INTEGER NOT NULL DEFAULT 0,
    "stock_marrakech" INTEGER NOT NULL DEFAULT 0,
    "stock_tanger" INTEGER NOT NULL DEFAULT 0,
    "stock_bouskoura" INTEGER NOT NULL DEFAULT 0,
    "stock_warehouse57" INTEGER NOT NULL DEFAULT 0,
    "available_cities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primary_city" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_syncs" (
    "id" TEXT NOT NULL,
    "last_sync" TIMESTAMP(3) NOT NULL,
    "total_products" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_syncs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_ref_produit_key" ON "products"("ref_produit");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_code_key" ON "cities"("code");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categorie_fkey" FOREIGN KEY ("categorie") REFERENCES "categories"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
