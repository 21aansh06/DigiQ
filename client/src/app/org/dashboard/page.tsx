'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { queueService, serviceService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { QueueWithDetails, Service } from '@/types';
import { getStatusColor, getStatusLabel, formatRelativeTime } from '@/lib/utils';
import { socketService } from '@/services/socket';
import { Users, Clock, Building2, ArrowRight, Activity } from 'lucide-react';

function OrgDashboardPage() {
  const { organization } = useAuthStore();
  const [queues, setQueues] = useState<QueueWithDetails[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!organization?._id) return;

      try {
        const [queuesRes, servicesRes] = await Promise.all([
          queueService.getOrgQueues(organization._id),
          serviceService.getOrgServices(organization._id),
        ]);

        if (queuesRes.success) {
          setQueues(queuesRes.queues as QueueWithDetails[]);
        }

        if (servicesRes.success) {
          setServices(servicesRes.services);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Setup socket for real-time updates
    if (organization?._id) {
      socketService.connect();
      socketService.joinOrgRoom(organization._id);

      const handleQueueUpdate = () => {
        fetchData();
      };

      socketService.onQueueUpdate(handleQueueUpdate);
      socketService.onQueueStatusChanged(handleQueueUpdate);

      return () => {
        socketService.leaveOrgRoom(organization._id);
        socketService.offQueueUpdate(handleQueueUpdate);
        socketService.offQueueStatusChanged(handleQueueUpdate);
      };
    }
  }, [organization]);

  const activeQueues = queues.filter((q) => q.status === 'waiting' || q.status === 'in_progress');
  const waitingCount = queues.filter((q) => q.status === 'waiting').length;
  const inProgressCount = queues.filter((q) => q.status === 'in_progress').length;
  const completedToday = queues.filter(
    (q) => q.status === 'completed' && new Date(q.completedAt || '').toDateString() === new Date().toDateString()
  ).length;

  return (
    <DashboardLayout role="org">
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organization Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back, {organization?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Building2 className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-slate-500">Total services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitingCount}</div>
              <p className="text-xs text-slate-500">In queue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCount}</div>
              <p className="text-xs text-slate-500">Being served</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedToday}</div>
              <p className="text-xs text-slate-500">Customers served</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Services</CardTitle>
              <CardDescription>Add, edit, or remove your services</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/org/services">
                <Button className="w-full">
                  View Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Queue Management</CardTitle>
              <CardDescription>View and manage active queues</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/org/queues">
                <Button className="w-full" variant="secondary">
                  View Queues
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Queue Activity</h2>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : activeQueues.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-slate-600">No active queues at the moment</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeQueues.slice(0, 5).map((queue) => (
                <Card key={queue._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                          {(queue.user as any)?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{(queue.user as any)?.name}</p>
                          <p className="text-sm text-slate-500">
                            {(queue.service as any)?.name} • Token #{queue.tokenNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(queue.status)}>
                          {getStatusLabel(queue.status)}
                        </Badge>
                        <span className="text-sm text-slate-400">
                          {formatRelativeTime(queue.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function OrgDashboard() {
  return (
    <ProtectedRoute role="org">
      <OrgDashboardPage />
    </ProtectedRoute>
  );
}
