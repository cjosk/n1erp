'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthGateProps {
  children: ReactNode;
}

const AuthGate = ({ children }: AuthGateProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<AuthState>('loading');

  const redirectTarget = useMemo(() => {
    if (!pathname) return '/';
    const query = searchParams?.toString();
    const combined = query ? `${pathname}?${query}` : pathname;
    if (!combined.startsWith('/')) {
      return '/';
    }
    return combined === '/' ? '/' : combined;
  }, [pathname, searchParams]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
        router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
      }
    });

    return () => unsubscribe();
  }, [redirectTarget, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] text-gray-600">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff7a00]/30 border-t-[#ff7a00]" />
        <p className="mt-4 text-sm font-medium">Oturum doğrulanıyor...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] text-gray-600">
        <div className="glass-card rounded-2xl border border-white/40 px-6 py-4 text-sm text-gray-600">
          Yönlendiriliyorsunuz...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;

