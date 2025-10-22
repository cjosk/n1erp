import { ReactNode, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGate from '@/components/AuthGate';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] text-gray-600">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff7a00]/30 border-t-[#ff7a00]" />
          <p className="mt-4 text-sm font-medium">Yükleniyor...</p>
        </div>
      }
    >
      <AuthGate>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto bg-[#f8f9fa] px-4 py-6 md:px-8 md:py-8">{children}</main>
          </div>
        </div>
      </AuthGate>
    </Suspense>
  );
};

export default DashboardLayout;
