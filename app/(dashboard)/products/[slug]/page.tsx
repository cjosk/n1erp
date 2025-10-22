'use client';

import { notFound } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

const slugToCategory: Record<string, string> = {
  seffaf: 'Şeffaf Ürün',
  baskili: 'Baskılı Ürün',
  'canvas-neon': 'Canvas Neon',
  'neon-masa': 'Neon Masa',
  'neon-ayna': 'Neon Ayna',
  'takim-dekoru': 'Takım Dekoru'
};

interface Props {
  params: { slug: string };
}

const ProductCategoryPage = ({ params }: Props) => {
  const category = slugToCategory[params.slug];

  if (!category) {
    notFound();
  }

  const { products, loading, error } = useProducts(category);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{category}</h1>
        <p className="text-sm text-gray-500">{category} kategorisindeki ürünleri görüntüleyin.</p>
      </div>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
};

export default ProductCategoryPage;
