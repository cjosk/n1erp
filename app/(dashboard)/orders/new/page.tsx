'use client';

import OrderForm from '@/components/OrderForm';

const NewOrderPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Yeni Sipariş Oluştur</h1>
        <p className="text-sm text-gray-500">
          Neonbir müşteri siparişlerini Firestore üzerinde kaydedin ve tüm süreci takip edin.
        </p>
      </div>
      <OrderForm />
    </div>
  );
};

export default NewOrderPage;
