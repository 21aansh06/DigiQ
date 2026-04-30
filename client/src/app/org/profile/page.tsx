'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { authService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Organization } from '@/types';
import { Building, Phone, Mail, MapPin } from 'lucide-react';

function OrgProfilePage() {
  const { organization: storeOrg, setOrganization } = useAuthStore();
  const [organization, setLocalOrg] = useState<Organization | null>(storeOrg);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getOrgProfile();
        if (response.success) {
          setLocalOrg(response.organization);
          setOrganization(response.organization);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setOrganization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    // Note: The backend doesn't have update profile endpoint
    // This is a placeholder for future implementation
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Organization profile updated successfully!' });
      setIsSaving(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="org">
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!organization) {
    return (
      <DashboardLayout role="org">
        <div className="text-center py-12">Organization not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="org">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Organization Profile</h1>
        <p className="text-slate-600 mb-8">Manage your organization information</p>

        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>View and update your organization profile details</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {message.text && (
                <Alert variant={message.type as any}>{message.text}</Alert>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                  {organization.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{organization.name}</p>
                  <p className="text-sm text-slate-500 capitalize">{organization.type}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    value={organization.name}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={organization.email}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={organization.phone || 'Not provided'}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="address"
                    type="text"
                    value={organization.address || 'Not provided'}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-slate-500 italic">
                  Profile editing is coming soon. Contact support to update your information.
                </p>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function OrgProfile() {
  return (
    <ProtectedRoute role="org">
      <OrgProfilePage />
    </ProtectedRoute>
  );
}
