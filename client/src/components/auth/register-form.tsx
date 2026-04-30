'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { authService } from '@/services/api';
import { OrgType } from '@/types';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  type: 'user' | 'org';
}

const orgTypeOptions = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'bank', label: 'Bank' },
  { value: 'office', label: 'Office' },
  { value: 'clinic', label: 'Clinic' },
];

export function RegisterForm({ type }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('hospital');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (type === 'user') {
        const response = await authService.registerUser({
          name,
          email,
          password,
          phone,
        });
        if (response.success) {
          router.push('/login');
        } else {
          setError(response.message || 'Registration failed');
        }
      } else {
        const response = await authService.registerOrg({
          name,
          email,
          password,
          address,
          type: orgType,
        });
        if (response.success) {
          router.push('/org/login');
        } else {
          setError(response.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === 'user' ? 'Create an account' : 'Register Organization';
  const description = type === 'user'
    ? 'Enter your details to create your account'
    : 'Register your organization to start managing queues';

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
            <Label htmlFor="name">{type === 'user' ? 'Full Name' : 'Organization Name'}</Label>
            <Input
              id="name"
              type="text"
              placeholder={type === 'user' ? 'John Doe' : 'Acme Inc.'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          {type === 'user' && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          {type === 'org' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St, City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Organization Type</Label>
                <Select
                  id="type"
                  options={orgTypeOptions}
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as OrgType)}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            Create Account
          </Button>

          {type === 'user' ? (
            <p className="text-sm text-center text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-slate-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          ) : (
            <p className="text-sm text-center text-slate-600">
              Already registered?{' '}
              <Link href="/org/login" className="text-slate-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
