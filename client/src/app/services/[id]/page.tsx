'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { serviceService, queueService } from '@/services/api';
import { socketService } from '@/services/socket';
import { Service, Queue, QueueUpdateEvent, QueueStatusEvent } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { getStatusColor, getStatusLabel, formatRelativeTime } from '@/lib/utils';
import { Building2, Clock, MapPin, Users, ArrowLeft, LogIn } from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const { isUserAuthenticated, user } = useAuthStore();

  const [service, setService] = useState<Service | null>(null);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [serviceRes, queuesRes] = await Promise.all([
        serviceService.getAllServices(),
        queueService.getServiceQueues(serviceId),
      ]);

      if (serviceRes.success) {
        const foundService = serviceRes.services.find((s) => s._id === serviceId);
        if (foundService) setService(foundService);
      }

      if (queuesRes.success) {
        setQueues(queuesRes.queues);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchData();

    // Setup socket connection
    socketService.connect();
    socketService.joinServiceRoom(serviceId);

    const handleQueueUpdate = (data: QueueUpdateEvent) => {
      if (data.action === 'join') {
        setQueues((prev) => [...prev, data.queue]);
      }
    };

    const handleStatusUpdate = (data: QueueStatusEvent) => {
      if (data.action === 'status_update') {
        setQueues((prev) =>
          prev.map((q) =>
            q._id === data.queueId ? { ...q, status: data.status } : q
          )
        );
      }
    };

    socketService.onQueueUpdate(handleQueueUpdate);
    socketService.onQueueStatusChanged(handleStatusUpdate);

    return () => {
      socketService.leaveServiceRoom(serviceId);
      socketService.offQueueUpdate(handleQueueUpdate);
      socketService.offQueueStatusChanged(handleStatusUpdate);
    };
  }, [serviceId, fetchData]);

  const handleJoinQueue = async () => {
    if (!isUserAuthenticated) {
      setError('Please login to join the queue');
      return;
    }

    setIsJoining(true);
    setError('');
    setSuccess('');

    try {
      const response = await queueService.joinQueue(serviceId);
      if (response.success) {
        setSuccess('Successfully joined the queue!');
        fetchData();
      } else {
        setError(response.message || 'Failed to join queue');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const waitingQueues = queues.filter((q) => q.status === 'waiting');
  const inProgressQueues = queues.filter((q) => q.status === 'in_progress');

  const isAlreadyInQueue = isUserAuthenticated && queues.some(
    (q) => 
      (q.status === 'waiting' || q.status === 'in_progress') && 
      ((q.user as any)?._id === user?._id || q.user === user?._id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">Loading...</div>
        </main>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p>Service not found</p>
            <Link href="/services">
              <Button variant="link">Back to services</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const org = service.organization as any;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Back Link */}
          <Link href="/services" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to services
          </Link>

          {/* Service Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Building2 className="h-4 w-4" />
                    {org.name}
                    <Badge variant="secondary" className="ml-2">
                      {org.type}
                    </Badge>
                  </CardDescription>
                </div>
                <Button
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={handleJoinQueue}
                  isLoading={isJoining}
                  disabled={!service.isActive || isAlreadyInQueue}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isAlreadyInQueue ? 'Already in Queue' : 'Join Queue'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
              {success && <Alert variant="success" className="mb-4">{success}</Alert>}

              {service.description && (
                <p className="text-slate-600">{service.description}</p>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Clock className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Avg. Time</p>
                    <p className="font-medium">{service.averageTimePerCustomer} min</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Waiting</p>
                    <p className="font-medium">{waitingQueues.length} people</p>
                  </div>
                </div>

                {org.address && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium truncate max-w-[200px]">{org.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Queue Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Queue</CardTitle>
              <CardDescription>
                Real-time queue status for this service
              </CardDescription>
            </CardHeader>

            <CardContent>
              {queues.length === 0 ? (
                <p className="text-center py-8 text-slate-500">No one in queue yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {/* In Progress */}
                  {inProgressQueues.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-2">In Progress</h3>
                      <div className="space-y-2">
                        {inProgressQueues.map((queue) => (
                          <div
                            key={queue._id}
                            className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
                              {(queue.user as any)?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{(queue.user as any)?.name}</p>
                              <p className="text-sm text-slate-500">Token #{queue.tokenNumber}</p>
                            </div>
                            <Badge className={getStatusColor(queue.status)}>
                              {getStatusLabel(queue.status)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Waiting */}
                  {waitingQueues.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-2">Waiting ({waitingQueues.length})</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {waitingQueues.map((queue, index) => (
                          <div
                            key={queue._id}
                            className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 font-bold">
                              {(queue.user as any)?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{(queue.user as any)?.name}</p>
                              <p className="text-sm text-slate-500">Token #{queue.tokenNumber}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400">Pos: {index + 1}</p>
                              <p className="text-xs text-slate-400">{formatRelativeTime(queue.joinedAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
