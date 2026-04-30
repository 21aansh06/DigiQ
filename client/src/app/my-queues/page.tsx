'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { queueService, serviceService } from '@/services/api';
import { socketService } from '@/services/socket';
import { Queue, QueueWithDetails, Service } from '@/types';
import { getStatusColor, getStatusLabel, formatRelativeTime, formatDuration } from '@/lib/utils';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

function MyQueuesPage() {
  const [activeQueues, setActiveQueues] = useState<QueueWithDetails[]>([]);
  const [pastQueues, setPastQueues] = useState<QueueWithDetails[]>([]);
  const [services, setServices] = useState<Record<string, Service>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [activeRes, pastRes, servicesRes] = await Promise.all([
        queueService.getUserQueues({ status: 'waiting,in_progress' }),
        queueService.getUserQueues({ status: 'completed,cancelled', page: historyPage, limit: itemsPerPage }),
        serviceService.getAllServices(),
      ]);

      if (activeRes.success) {
        setActiveQueues(activeRes.queues as QueueWithDetails[]);
      }

      if (pastRes.success) {
        setPastQueues(pastRes.queues as QueueWithDetails[]);
        if (pastRes.pagination) {
          setTotalPages(pastRes.pagination.totalPages || 1);
        }
      }

      if (servicesRes.success) {
        const servicesMap: Record<string, Service> = {};
        servicesRes.services.forEach((s) => {
          servicesMap[s._id] = s;
        });
        setServices(servicesMap);
      }
    } catch (error) {
      console.error('Error fetching queues:', error);
    } finally {
      setIsLoading(false);
    }
  }, [historyPage, itemsPerPage]);

  useEffect(() => {
    fetchData();

    // Setup socket for real-time updates
    socketService.connect();

    const handleQueueUpdate = () => {
      fetchData();
    };

    socketService.onQueueUpdate(handleQueueUpdate);
    socketService.onQueueStatusChanged(handleQueueUpdate);

    return () => {
      socketService.offQueueUpdate(handleQueueUpdate);
      socketService.offQueueStatusChanged(handleQueueUpdate);
    };
  }, [fetchData]);

  return (
    <DashboardLayout role="user">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Queues</h1>
            <p className="text-slate-600 mt-2">Track your queue positions in real-time</p>
          </div>          
        </div>

        {/* Active Queues */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Queues</h2>

          {isLoading && activeQueues.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : activeQueues.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600 mb-4">You&apos;re not in any active queues</p>
              <Link href="/services">
                <Button>
                  Browse Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeQueues.map((queue) => {
                const service = queue.service as any;
                const org = queue.organization as any;

                return (
                  <Card key={queue._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{service?.name}</h3>
                            <Badge className={getStatusColor(queue.status)}>
                              {getStatusLabel(queue.status)}
                            </Badge>
                          </div>

                          <p className="text-sm text-slate-500">{org.name}</p>

                          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {org.address || 'No address'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Joined {formatRelativeTime(queue.joinedAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-slate-500">Token</p>
                            <p className="text-3xl font-bold text-slate-900">#{queue.tokenNumber}</p>
                          </div>

                          {queue.status === 'waiting' && queue.estimatedWaitTime && (
                            <div className="text-center">
                              <p className="text-sm text-slate-500">Est. Wait</p>
                              <p className="text-lg font-medium text-slate-900">
                                {formatDuration(queue.estimatedWaitTime)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Queues */}
        {pastQueues.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">History</h2>

            <div className="grid gap-4">
              {pastQueues.map((queue) => {
                const service = queue.service as any;
                const org = queue.organization as any;

                return (
                  <Card key={queue._id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{service?.name}</p>
                          <p className="text-sm text-slate-500">{org?.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(queue.status)}>
                            {getStatusLabel(queue.status)}
                          </Badge>
                          <span className="text-sm text-slate-400">
                            #{queue.tokenNumber}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  disabled={historyPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-500">
                  Page {historyPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
                  disabled={historyPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function MyQueues() {
  return (
    <ProtectedRoute role="user">
      <MyQueuesPage />
    </ProtectedRoute>
  );
}
