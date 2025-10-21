'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where, type QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toIsoString } from '@/lib/firestore';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
}

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (category) {
      constraints.unshift(where('category', '==', category));
    }

    const q = query(productsRef, ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<Product> & Record<string, unknown>;
          return {
            id: doc.id,
            name: data.name ?? 'İsimsiz Ürün',
            category: data.category ?? 'Genel',
            price: Number(data.price ?? 0),
            imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
            description: typeof data.description === 'string' ? data.description : undefined,
            createdAt: toIsoString(data.createdAt) ?? toIsoString(data.createdAtTimestamp)
          };
        });
        setProducts(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Ürünler yüklenemedi', err);
        setProducts([]);
        setError('Ürünler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [category]);

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((product) => product.category === category);
  }, [category, products]);

  return { products: filtered, loading, error };
}
