'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

  useEffect(() => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      }));
      setProducts(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = category ? products.filter((product) => product.category === category) : products;

  return { products: filtered, loading };
}
