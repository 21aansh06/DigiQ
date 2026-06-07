'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { isUserAuthenticated, isOrgAuthenticated } = useAuthStore();
  const isAuthenticated = isUserAuthenticated || isOrgAuthenticated;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={cn('border-b border-slate-200 bg-white sticky top-0 z-40', className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">
            Q
          </div>
          <span className="text-xl font-bold text-slate-900">Digi-Q</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Services
          </Link>
        </nav>

        {/* Desktop & Tablet Auth Buttons / Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild variant="default">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="flex items-center justify-center p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 shadow-sm">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1"
            >
              Home
            </Link>
            <Link
              href="/services"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1"
            >
              Services
            </Link>
          </nav>

          {/* Auth links for xs screen (where they are hidden from main header) */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 sm:hidden">
            {isAuthenticated ? (
              <Button asChild variant="default" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="w-full justify-center" onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="default" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

