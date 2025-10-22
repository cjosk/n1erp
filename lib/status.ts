import type { OrderStatus } from './types';

export const STATUS_COLORS: Record<OrderStatus, string> = {
  'Gönderilen Ürünler': 'bg-gray-100 text-gray-700 border border-gray-200',
  'Kargo Aşamasında': 'bg-purple-100 text-purple-700 border border-purple-200',
  'Üretimi Tamamlandı': 'bg-green-100 text-green-700 border border-green-200',
  'Üretime Alındı': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Çizildi': 'bg-sky-100 text-sky-700 border border-sky-200',
  'Çizilmeyi Bekleyenler': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Gecikti': 'bg-red-100 text-red-700 border border-red-200'
};

export const STATUS_FLOW: OrderStatus[] = [
  'Çizilmeyi Bekleyenler',
  'Çizildi',
  'Üretime Alındı',
  'Üretimi Tamamlandı',
  'Kargo Aşamasında',
  'Gönderilen Ürünler',
  'Gecikti'
];
