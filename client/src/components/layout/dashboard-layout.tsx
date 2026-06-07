'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'user' | 'org';
  className?: string;
}

export function DashboardLayout({ children, role, className }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={cn('flex h-screen flex-col md:flex-row bg-slate-50 overflow-hidden', className)}>
      {/* Mobile Top Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">
            Q
          </div>
          <span className="text-lg font-bold text-slate-900">Digi-Q</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="text-slate-600 hover:text-slate-900 focus:outline-none p-1.5"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Mobile Sidebar Overlay (Drawer) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 focus:outline-none"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <Sidebar role={role} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

