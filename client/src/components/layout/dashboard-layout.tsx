'use client';

import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'user' | 'org';
  className?: string;
}

export function DashboardLayout({ children, role, className }: DashboardLayoutProps) {
  return (
    <div className={cn('flex h-screen bg-slate-50', className)}>
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
}
