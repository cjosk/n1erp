export type OrderStatus =
  | 'Çizilmeyi Bekleyenler'
  | 'Çizildi'
  | 'Üretime Alındı'
  | 'Üretimi Tamamlandı'
  | 'Kargo Aşamasında'
  | 'Gönderilen Ürünler'
  | 'Gecikti';

export interface Order {
  id: string;
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
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'Admin' | 'Üretim' | 'Kargo';
  createdAt: string;
}

export interface LogEntry {
  id: string;
  userId: string;
  action: string;
  createdAt: string;
}
