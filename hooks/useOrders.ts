'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus } from '@/lib/types';

interface Options {
  status?: OrderStatus;
}

const parseOrder = (doc: QueryDocumentSnapshot<DocumentData>): Order => {
  const data = doc.data();
  return {
    id: doc.id,
    productName: data.productName ?? '',
    customerName: data.customerName ?? '',
    category: data.category ?? '',
    price: Number(data.price ?? 0),
    quantity: Number(data.quantity ?? 1),
    status: (data.status ?? 'Çizilmeyi Bekleyenler') as OrderStatus,
    deliveryDate: data.deliveryDate ?? undefined,
    franchiseId: data.franchiseId ?? undefined,
    accessories: data.accessories ?? [],
    notes: data.notes ?? undefined,
    imageUrl: data.imageUrl ?? undefined,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? undefined
  };
};

export function useOrders(options?: Options) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(parseOrder);
      setOrders(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    if (!options?.status) return orders;
    return orders.filter((order) => order.status === options.status);
  }, [orders, options?.status]);

  return {
    orders: filtered,
    loading
  };
}
