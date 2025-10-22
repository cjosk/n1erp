'use client';

import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';

const roles: User['role'][] = ['Admin', 'Üretim', 'Kargo'];

const AdminUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ displayName: '', email: '', role: 'Üretim' as User['role'] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>)
      }));
      setUsers(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.displayName || !form.email) return;

    await addDoc(collection(db, 'users'), {
      displayName: form.displayName,
      email: form.email,
      role: form.role,
      createdAt: new Date().toISOString()
    });

    setForm({ displayName: '', email: '', role: 'Üretim' });
  };

  const handleRoleChange = async (userId: string, role: User['role']) => {
    await updateDoc(doc(db, 'users', userId), { role });
  };

  const handleDelete = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-white/40 p-6 grid gap-4 md:grid-cols-4">
        <input
          value={form.displayName}
          onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
          placeholder="Çalışan adı"
          className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
        />
        <input
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Email"
          className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
        />
        <select
          value={form.role}
          onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as User['role'] }))}
          className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-[#ff7a00] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#ff6a00]">
          Çalışan Ekle
        </button>
      </form>

      <div className="glass-card rounded-2xl border border-white/40 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Çalışan Listesi</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Yükleniyor...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/40 text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">İsim</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Rol</th>
                  <th className="px-4 py-3 font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/50">
                    <td className="px-4 py-3 font-medium text-gray-800">{user.displayName}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event.target.value as User['role'])}
                        className="rounded-xl border border-white/40 bg-white/70 px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
