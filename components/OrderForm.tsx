'use client';

import { useForm } from 'react-hook-form';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import type { Order, OrderStatus } from '@/lib/types';
import { STATUS_FLOW } from '@/lib/status';

const accessoriesOptions = ['Dimmer', 'Askı Aparatı', 'Ek Güç Kaynağı', 'Montaj Seti'];

type OrderFormValues = {
  productName: string;
  customerName: string;
  category: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  deliveryDate?: string;
  franchiseId?: string;
  accessories?: string[];
  notes?: string;
  image?: FileList;
};

interface OrderFormProps {
  order?: Order;
  onSuccess?: () => void;
}

const OrderForm = ({ order, onSuccess }: OrderFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<OrderFormValues>({
    defaultValues: order
      ? {
          productName: order.productName,
          customerName: order.customerName,
          category: order.category,
          price: order.price,
          quantity: order.quantity,
          status: order.status,
          deliveryDate: order.deliveryDate,
          franchiseId: order.franchiseId,
          accessories: order.accessories,
          notes: order.notes
        }
      : {
          status: 'Çizilmeyi Bekleyenler',
          quantity: 1
        }
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      setUploading(true);

      let imageUrl = order?.imageUrl;

      if (values.image?.[0]) {
        const imageFile = values.image[0];
        const storageRef = ref(storage, `product_images/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const nowIso = new Date().toISOString();
      const payload = {
        productName: values.productName,
        customerName: values.customerName,
        category: values.category,
        price: Number(values.price),
        quantity: Number(values.quantity ?? 1),
        status: values.status,
        deliveryDate: values.deliveryDate ?? null,
        franchiseId: values.franchiseId ?? null,
        accessories: values.accessories ?? [],
        notes: values.notes ?? '',
        imageUrl: imageUrl ?? null,
        updatedAt: nowIso,
        updatedAtTimestamp: serverTimestamp()
      };

      if (order) {
        await updateDoc(doc(db, 'orders', order.id), payload);
      } else {
        await addDoc(collection(db, 'orders'), {
          ...payload,
          createdAt: nowIso,
          createdAtTimestamp: serverTimestamp(),
          statusHistory: [values.status],
          total: Number(values.price) * Number(values.quantity ?? 1),
          timestamp: serverTimestamp()
        });
        reset();
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError('Sipariş kaydedilirken bir sorun oluştu.');
    } finally {
      setUploading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl border border-white/40 p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ürün İsmi</label>
          <input
            {...register('productName', { required: true })}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
            placeholder="Ürün adı"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Müşteri İsmi</label>
          <input
            {...register('customerName', { required: true })}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
            placeholder="Müşteri adı"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Kategori</label>
          <input
            {...register('category', { required: true })}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
            placeholder="Örn. Neon Masa"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fiyat (₺)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: true, valueAsNumber: true })}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Adet</label>
          <input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Üretim Durumu</label>
          <select
            {...register('status', { required: true })}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          >
            {STATUS_FLOW.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Hedef Teslim Tarihi</label>
          <input
            type="date"
            {...register('deliveryDate')}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Franchise ID</label>
          <input
            {...register('franchiseId')}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Görsel Yükle</label>
          <input type="file" accept="image/*" {...register('image')} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Aksesuarlar</label>
          <div className="flex flex-wrap gap-3">
            {accessoriesOptions.map((item) => (
              <label key={item} className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" value={item} {...register('accessories')} className="rounded border-gray-300 text-[#ff7a00]" />
                {item}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Notlar</label>
          <textarea
            rows={4}
            {...register('notes')}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="rounded-xl bg-[#ff7a00] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#ff6a00] disabled:opacity-60"
        >
          {order ? 'Siparişi Güncelle' : 'Yeni Sipariş Ekle'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
