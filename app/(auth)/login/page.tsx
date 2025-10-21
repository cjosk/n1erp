'use client';

import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = useMemo(() => {
    const target = searchParams.get('redirect') ?? '/';
    return target.startsWith('/') ? target : '/';
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace(redirectPath);
      }
    });

    return () => unsubscribe();
  }, [redirectPath, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace(redirectPath);
    } catch (err) {
      console.error(err);
      setError('Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md rounded-3xl border border-white/40 p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#ff7a00] flex items-center justify-center text-white text-xl font-bold">N1</div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Neon1 ERP Giriş</h1>
            <p className="text-sm text-gray-500">Admin ve ekip üyeleri için giriş</p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-gray-500">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-gray-500">Şifre</label>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#ff7a00] py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#ff6a00] disabled:opacity-60"
        >
          Giriş Yap
        </button>
        <p className="text-center text-xs text-gray-400">
          Destek için <Link href="https://www.neonbirr.com" target="_blank" className="text-[#ff7a00]">Neonbir</Link> ile iletişime geçin.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
