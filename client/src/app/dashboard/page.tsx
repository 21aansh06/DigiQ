'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { queueService, authService } from '@/services/api';
import { QueueWithDetails } from '@/types';
import { getStatusColor, getStatusLabel, formatRelativeTime } from '@/lib/utils';
import { Clock, MapPin, Users, ArrowRight, Building } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

function DashboardPage() {
  const { user } = useAuthStore();
  const [activeQueues, setActiveQueues] = useState<QueueWithDetails[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrg, setHasOrg] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserQueues = async () => {
      try {
        const [activeRes, completedRes] = await Promise.all([
          queueService.getUserQueues({ status: 'waiting,in_progress' }),
          queueService.getUserQueues({ status: 'completed', limit: 1 }),
        ]);

        if (activeRes.success) {
          setActiveQueues(activeRes.queues as QueueWithDetails[]);
        }
        if (completedRes.success && completedRes.pagination) {
          setCompletedCount(completedRes.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching queues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserQueues();

    if (user?.role === 'organization') {
      authService.getMyOrg().then((res) => {
        if (res.success && res.organization) {
          setHasOrg(true);
        } else {
          setHasOrg(false);
        }
      }).catch(() => {
        setHasOrg(false);
      });
    }
  }, [user]);

  return (
    <DashboardLayout role="user">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your queue positions and explore services</p>
        </div>

        {user?.role === 'organization' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Management
              </CardTitle>
              <CardDescription className="text-blue-700">
                You have an organization account. Manage your services and queues here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasOrg === true ? (
                <Link href="/org/dashboard">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    Manage Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : hasOrg === false ? (
                <Link href="/org/register">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    Create
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <div className="text-sm text-blue-600">Loading organization status...</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeQueues.length}</div>
              <p className="text-xs text-slate-500">Currently waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-slate-500">Visits completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
              <MapPin className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <Link href="/services">
                <Button className="w-full" variant="secondary">
                  Browse Services
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Active Queues Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Your Active Queues</h2>
            <Link href="/my-queues" className="text-sm font-medium text-slate-900 hover:underline">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : activeQueues.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600 mb-4">You&apos;re not in any queues yet</p>
              <Link href="/services">
                <Button>
                  Find Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeQueues.slice(0, 3).map((queue) => (
                <Card key={queue._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {(queue.service as any)?.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {(queue.organization as any)?.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className={getStatusColor(queue.status)}>
                            {getStatusLabel(queue.status)}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            Token #{queue.tokenNumber}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Joined</p>
                        <p className="text-sm font-medium">{formatRelativeTime(queue.joinedAt)}</p>
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

export default function Dashboard() {
  return (
    <ProtectedRoute role="user">
      <DashboardPage />
    </ProtectedRoute>
  );
}
