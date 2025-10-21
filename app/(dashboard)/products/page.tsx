'use client';

import ProductGrid from '@/components/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

const ProductsPage = () => {
  const { products, loading, error } = useProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tüm Ürünler</h1>
        <p className="text-sm text-gray-500">Neonbir ürün portföyünü görüntüleyin ve stok durumunu takip edin.</p>
      </div>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
};

export default ProductsPage;
