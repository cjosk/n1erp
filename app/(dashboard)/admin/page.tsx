'use client';

import AdminUserList from '@/components/AdminUserList';
import ActivityLog from '@/components/ActivityLog';

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Yönetimi</h1>
        <p className="text-sm text-gray-500">
          Çalışan rollerini ve giriş loglarını yönetin. Yetkilere göre görünürlük sağlayın.
        </p>
      </div>
      <AdminUserList />
      <ActivityLog />
    </div>
  );
};

export default AdminPage;
