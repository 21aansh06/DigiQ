'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Building2,
  ClipboardList,
  ScanLine,
  Search,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/api';

interface SidebarProps {
  role: 'user' | 'org';
}

const userNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/services', label: 'Browse Services', icon: Search },
  { href: '/my-queues', label: 'My Queues', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: Settings },
];

const orgNavItems = [
  { href: '/org/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/org/services', label: 'Services', icon: Building2 },
  { href: '/org/queues', label: 'Queue Management', icon: Users },
  { href: '/org/profile', label: 'Profile', icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { user, organization, clearUserAuth, clearOrgAuth, setActiveRole } = useAuthStore();

  const navItems = role === 'user' ? userNavItems : orgNavItems;
  const entity = role === 'user' ? user : organization;
  const name = entity?.name || 'User';

  const handleLogout = async () => {
    try {
      if (role === 'user') {
        await authService.logoutUser();
        clearUserAuth();
      } else {
        await authService.logoutOrg();
        clearOrgAuth();
      }
      setActiveRole(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">
            Q
          </div>
          <span className="text-lg font-bold text-slate-900">Digi-Q</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            fallback={name.charAt(0).toUpperCase()}
            className="h-10 w-10"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
            <p className="text-xs text-slate-500 capitalize">{role === 'user' ? 'Service User' : 'Organization'}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
