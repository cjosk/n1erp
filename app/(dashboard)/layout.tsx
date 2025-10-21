import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 bg-[#f8f9fa] overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
