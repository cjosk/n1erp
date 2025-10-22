'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { FiHome, FiArchive, FiTruck, FiPlusCircle, FiDollarSign, FiSettings } from 'react-icons/fi';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Ana Menü',
    items: [
      { label: 'Anasayfa', href: '/', icon: FiHome }
    ]
  },
  {
    title: 'Ürün Kategorisi',
    items: [
      { label: 'Tüm Ürünler', href: '/products', icon: FiArchive },
      { label: 'Şeffaf Ürün', href: '/products/seffaf', icon: FiArchive },
      { label: 'Baskılı Ürün', href: '/products/baskili', icon: FiArchive },
      { label: 'Canvas Neon', href: '/products/canvas-neon', icon: FiArchive },
      { label: 'Neon Masa', href: '/products/neon-masa', icon: FiArchive },
      { label: 'Neon Ayna', href: '/products/neon-ayna', icon: FiArchive },
      { label: 'Takım Dekoru', href: '/products/takim-dekoru', icon: FiArchive }
    ]
  },
  {
    title: 'Sipariş Kategorisi',
    items: [
      { label: 'Tüm Durumlar', href: '/orders', icon: FiTruck },
      { label: 'Çizilmeyi Bekleyenler', href: '/orders/status/cizilmeyi-bekleyenler', icon: FiTruck },
      { label: 'Çizildi', href: '/orders/status/cizildi', icon: FiTruck },
      { label: 'Üretime Alındı', href: '/orders/status/uretime-alindi', icon: FiTruck },
      { label: 'Üretimi Tamamlandı', href: '/orders/status/uretimi-tamamlandi', icon: FiTruck },
      { label: 'Kargo Aşamasında', href: '/orders/status/kargo-asamasinda', icon: FiTruck },
      { label: 'Gönderilen Ürünler', href: '/orders/status/gonderilen-urunler', icon: FiTruck },
      { label: 'Gecikti', href: '/orders/status/gecikti', icon: FiTruck }
    ]
  },
  {
    title: 'Sipariş Yönetimi',
    items: [
      { label: 'Sipariş Ekle', href: '/orders/new', icon: FiPlusCircle }
    ]
  },
  {
    title: 'Analiz ve Yönetim',
    items: [
      { label: 'Finansal Raporlar', href: '/reports', icon: FiDollarSign },
      { label: 'Admin Yönetimi', href: '/admin', icon: FiSettings }
    ]
  }
];

const isActive = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
};

const Sidebar = () => {
  const pathname = usePathname();

  const activeMap = useMemo(() => {
    if (!pathname) return new Set<string>();
    const set = new Set<string>();
    sections.forEach((section) => {
      section.items.forEach((item) => {
        if (isActive(pathname, item.href)) {
          set.add(item.href);
        }
      });
    });
    return set;
  }, [pathname]);

  return (
    <aside className="w-72 hidden lg:flex flex-col gap-6 p-6 bg-white/60 backdrop-blur-lg border-r border-white/40 shadow-glass min-h-screen">
      <div className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-[var(--neon-orange)] flex items-center justify-center text-white font-bold text-xl">
          N1
        </span>
        <div>
          <p className="text-lg font-semibold text-gray-900">Neon1 ERP</p>
          <p className="text-sm text-gray-500">Neonbir İç Sistem</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto pr-2">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                const active = activeMap.has(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-2 rounded-xl transition-colors duration-200',
                        active
                          ? 'bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/40'
                          : 'text-gray-600 hover:bg-white/60 hover:text-[#ff7a00]'
                      )}
                    >
                      <ItemIcon className="text-lg" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
