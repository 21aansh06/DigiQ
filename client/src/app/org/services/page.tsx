'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { serviceService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Service } from '@/types';
import { Clock, Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrgServicesPage() {
  const { organization } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avgTime, setAvgTime] = useState(10);

  const fetchServices = async () => {
    if (!organization?._id) return;

    try {
      const response = await serviceService.getOrgServices(organization._id);
      if (response.success) {
        setServices(response.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [organization]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setAvgTime(10);
    setEditingService(null);
    setError('');
    setSuccess('');
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description || '');
    setAvgTime(service.averageTimePerCustomer);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingService) {
        const response = await serviceService.updateService(editingService._id, {
          name,
          description,
        });
        if (response.success) {
          setSuccess('Service updated successfully!');
          fetchServices();
          setTimeout(() => closeDialog(), 1000);
        } else {
          // setError(response.message || 'Failed to update service');
        }
      } else {
        const response = await serviceService.addService({
          name,
          description,
          averageTimePerCustomer: avgTime,
        });
        if (response.success) {
          setSuccess('Service added successfully!');
          fetchServices();
          setTimeout(() => closeDialog(), 1000);
        } else {
          // setError(response.message || 'Failed to add service');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await serviceService.deleteService(serviceId);
      if (response.success) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <DashboardLayout role="org">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Services</h1>
            <p className="text-slate-600 mt-2">Manage your organization&apos;s services</p>
          </div>
          <Button onClick={openAddDialog} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : services.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 mb-4">No services yet. Add your first service!</p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {service.description || 'No description'}
                      </CardDescription>
                    </div>
                    <Badge variant={service.isActive ? 'success' : 'secondary'}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>{service.averageTimePerCustomer} min per customer</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(service._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? 'Update your service details'
                  : 'Create a new service for your organization'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && <Alert variant="destructive">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., General Consultation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the service"
                />
              </div>

              {!editingService && (
                <div className="space-y-2">
                  <Label htmlFor="avgTime">Average Time per Customer (minutes)</Label>
                  <Input
                    id="avgTime"
                    type="number"
                    min={1}
                    value={avgTime}
                    onChange={(e) => setAvgTime(parseInt(e.target.value) || 10)}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingService ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// Simple Dialog Components
// function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//       <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
//         {children}
//       </div>
//     </div>
//   );
// }

// function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
//   return <div className={className}>{children}</div>;
// }

// function DialogHeader({ children }: { children: React.ReactNode }) {
//   return <div className="mb-4">{children}</div>;
// }

// function DialogTitle({ children }: { children: React.ReactNode }) {
//   return <h2 className="text-lg font-semibold">{children}</h2>;
// }

// function DialogDescription({ children }: { children: React.ReactNode }) {
//   return <p className="text-sm text-slate-500 mt-1">{children}</p>;
// }

export default function OrgServices() {
  return (
    <ProtectedRoute role="org">
      <OrgServicesPage />
    </ProtectedRoute>
  );
}
