import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGate from '@/components/AuthGate';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGate>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto bg-[#f8f9fa] px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
};

export default DashboardLayout;
