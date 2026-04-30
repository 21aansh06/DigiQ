'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { authService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  type: 'user' | 'org';
}

export function LoginForm({ type }: LoginFormProps) {
  const router = useRouter();
  const { setUser, setOrganization, setActiveRole } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (type === 'user') {
        const response = await authService.loginUser({ email, password });
        if (response.success) {
          setUser(response.user!);
          setActiveRole('user');
          router.push('/dashboard');
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        const response = await authService.loginOrg({ email, password });
        if (response.success) {
          setOrganization(response.organization!);
          setActiveRole('org');
          router.push('/org/dashboard');
        } else {
          setError(response.message || 'Login failed');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === 'user' ? 'Sign in to your account' : 'Organization Sign In';
  const description = type === 'user'
    ? 'Enter your credentials to access your account'
    : 'Sign in to manage your organization';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">{error}</Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>

          {type === 'user' ? (
            <p className="text-sm text-center text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-slate-900 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-sm text-center text-slate-600">
              Want to register your organization?{' '}
              <Link href="/org/register" className="text-slate-900 font-medium hover:underline">
                Register here
              </Link>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
