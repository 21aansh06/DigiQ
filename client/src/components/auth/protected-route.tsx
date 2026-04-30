'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'user' | 'org';
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const {
    user,
    organization,
    isUserAuthenticated,
    isOrgAuthenticated,
    setUser,
    setOrganization,
    setActiveRole,
  } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (role === 'user') {
          if (isUserAuthenticated && user) {
            setIsLoading(false);
            return;
          }

          const response = await authService.getUserProfile();
          if (response.success) {
            setUser(response.user);
            setActiveRole('user');
          } else {
            router.push('/login');
          }
        } else {
          if (isOrgAuthenticated && organization) {
            setIsLoading(false);
            return;
          }

          const response = await authService.getOrgProfile();
          if (response.success) {
            setOrganization(response.organization);
            setActiveRole('org');
          } else {
            router.push('/org/login');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (role === 'user') {
          router.push('/login');
        } else {
          router.push('/org/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [role, router, setUser, setOrganization, setActiveRole, isUserAuthenticated, isOrgAuthenticated, user, organization]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
      </div>
    );
  }

  if (role === 'user' && !isUserAuthenticated) {
    return null;
  }

  if (role === 'org' && !isOrgAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
