'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus } from '@/lib/types';
import { toIsoString } from '@/lib/firestore';

interface Options {
  status?: OrderStatus;
}

const parseOrder = (doc: QueryDocumentSnapshot<DocumentData>): Order => {
  const data = doc.data();
  const createdAt =
    toIsoString(data.createdAt) ??
    toIsoString(data.createdAtTimestamp) ??
    toIsoString(data.timestamp) ??
    new Date().toISOString();
  const updatedAt = toIsoString(data.updatedAt) ?? toIsoString(data.updatedAtTimestamp);
  return {
    id: doc.id,
    productName: data.productName ?? '',
    customerName: data.customerName ?? '',
    category: data.category ?? '',
    price: Number(data.price ?? 0),
    quantity: Number(data.quantity ?? 1),
    status: (data.status ?? 'Çizilmeyi Bekleyenler') as OrderStatus,
    deliveryDate: toIsoString(data.deliveryDate) ?? data.deliveryDate ?? undefined,
    franchiseId: data.franchiseId ?? undefined,
    accessories: data.accessories ?? [],
    notes: data.notes ?? undefined,
    imageUrl: data.imageUrl ?? undefined,
    createdAt,
    updatedAt
  };
};

export function useOrders(options?: Options) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const ordersRef = collection(db, 'orders');
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const startListening = (orderField: 'timestamp' | 'createdAt') => {
      if (unsubscribe) {
        unsubscribe();
      }

      const constraints: QueryConstraint[] = [];

      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }

      constraints.push(orderBy(orderField, 'desc'));

      unsubscribe = onSnapshot(
        query(ordersRef, ...constraints),
        (snapshot) => {
          if (cancelled) return;
          const docs = snapshot.docs.map(parseOrder);
          setOrders(docs);
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          console.error('Siparişler yüklenemedi', err);
          if (orderField === 'timestamp') {
            startListening('createdAt');
            return;
          }
          setOrders([]);
          setError('Siparişler yüklenirken bir hata oluştu.');
          setLoading(false);
        }
      );
    };

    startListening('timestamp');

    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [options?.status]);

  const filtered = useMemo(() => {
    if (!options?.status) return orders;
    return orders.filter((order) => order.status === options.status);
  }, [orders, options?.status]);

  return {
    orders: filtered,
    loading,
    error
  };
}
