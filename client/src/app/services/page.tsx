'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { serviceService } from '@/services/api';
import { Service } from '@/types';
import { getOrgTypeIcon } from '@/lib/utils';
import { Search, Building2, Clock, MapPin } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAllServices();
        if (response.success) {
          setServices(response.services);
          setFilteredServices(response.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) => {
      const searchLower = searchQuery.toLowerCase();
      const orgName = (service.organization as any)?.name?.toLowerCase() || '';
      return (
        service.name.toLowerCase().includes(searchLower) ||
        orgName.includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">Browse Services</h1>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              Find and join queues at hospitals, banks, clinics, and offices near you
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search services or organizations..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading services...</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No services found matching your search</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => {
                const org = service.organization as any;
                return (
                  <Card key={service._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3" />
                            {org.name}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {getOrgTypeIcon(org.type)} {org.type}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {service.description && (
                        <p className="text-sm text-slate-600">{service.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.averageTimePerCustomer} min/service</span>
                        </div>
                      </div>

                      {org.address && (
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{org.address}</span>
                        </div>
                      )}

                      <Link href={`/services/${service._id}`}>
                        <Button className="w-full">View Queue</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
