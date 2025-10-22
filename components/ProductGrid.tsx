'use client';

import Image from 'next/image';
import type { Product } from '@/hooks/useProducts';

interface Props {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

const ProductGrid = ({ products, loading, error }: Props) => {
  if (error) {
    return <div className="glass-card rounded-2xl border border-white/40 p-6 text-sm text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="glass-card rounded-2xl border border-white/40 p-6 text-sm text-gray-500">Ürünler yükleniyor...</div>;
  }

  if (!products.length) {
    return <div className="glass-card rounded-2xl border border-white/40 p-6 text-sm text-gray-500">Henüz ürün eklenmedi.</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="glass-card rounded-2xl border border-white/40 p-5 space-y-3">
          <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/40 bg-white/40">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">Görsel Yok</div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
          </div>
          <p className="text-sm text-gray-600 max-h-12 overflow-hidden">{product.description ?? 'Açıklama eklenmedi.'}</p>
          <p className="text-base font-semibold text-[#ff7a00]">₺{product.price.toLocaleString('tr-TR')}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
