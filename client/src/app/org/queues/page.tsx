'use client';

import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { queueService } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuthStore } from '@/store/authStore';
import { QueueWithDetails, QueueStatus } from '@/types';
import { getStatusColor, getStatusLabel, formatRelativeTime, getInitials } from '@/lib/utils';
import { Users, Play, CheckCircle, XCircle } from 'lucide-react';

const statusOptions = [
  { value: 'waiting', label: 'Waiting' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function OrgQueuesPage() {
  const { organization } = useAuthStore();
  const [queues, setQueues] = useState<QueueWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueues = useCallback(async () => {
    if (!organization?._id) return;

    try {
      const response = await queueService.getOrgQueues(organization._id);
      if (response.success) {
        setQueues(response.queues as QueueWithDetails[]);
      }
    } catch (error) {
      console.error('Error fetching queues:', error);
    } finally {
      setIsLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    fetchQueues();

    if (!organization?._id) return;

    // Setup socket for real-time updates
    socketService.connect();
    socketService.joinOrgRoom(organization._id);

    const handleQueueUpdate = () => {
      fetchQueues();
    };

    socketService.onQueueUpdate(handleQueueUpdate);
    socketService.onQueueStatusChanged(handleQueueUpdate);

    return () => {
      socketService.leaveOrgRoom(organization._id);
      socketService.offQueueUpdate(handleQueueUpdate);
      socketService.offQueueStatusChanged(handleQueueUpdate);
    };
  }, [fetchQueues, organization?._id]);

  const handleStatusChange = async (queueId: string, status: QueueStatus) => {
    try {
      const response = await queueService.updateQueueStatus(queueId, status);
      if (response.success) {
        fetchQueues();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (queueId: string) => {
    if (!confirm('Are you sure you want to remove this person from the queue?')) return;

    try {
      await queueService.deleteQueue(queueId);
      fetchQueues();
    } catch (error) {
      console.error('Error deleting queue:', error);
    }
  };

  const waitingQueues = queues.filter((q) => q.status === 'waiting');
  const inProgressQueues = queues.filter((q) => q.status === 'in_progress');
  const completedQueues = queues.filter((q) => q.status === 'completed');
  const cancelledQueues = queues.filter((q) => q.status === 'cancelled');

  const QueueCard = ({ queue }: { queue: QueueWithDetails }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
              {getInitials((queue.user as any)?.name)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{(queue.user as any)?.name}</p>
              <p className="text-sm text-slate-500 truncate">
                {(queue.service as any)?.name} • Token #{queue.tokenNumber}
              </p>
              <p className="text-xs text-slate-400">{formatRelativeTime(queue.joinedAt)}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t pt-3 mt-1 sm:border-t-0 sm:pt-0 sm:mt-0 w-full sm:w-auto">
            <Badge className={getStatusColor(queue.status)}>
              {getStatusLabel(queue.status)}
            </Badge>

            {queue.status === 'waiting' && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(queue._id, 'in_progress')}
                  title="Start Service"
                >
                  <Play className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleStatusChange(queue._id, 'cancelled')}
                  title="Cancel"
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            )}

            {queue.status === 'in_progress' && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600"
                  onClick={() => handleStatusChange(queue._id, 'completed')}
                  title="Complete"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              </div>
            )}

            {(queue.status === 'completed' || queue.status === 'cancelled') && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600"
                onClick={() => handleDelete(queue._id)}
                title="Remove"
              >
                <XCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout role="org">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Queue Management</h1>
            <p className="text-slate-600 mt-2">Manage your organization&apos;s queues</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitingQueues.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressQueues.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedQueues.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledQueues.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Queues */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Waiting */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Waiting ({waitingQueues.length})
            </h2>

            <div className="space-y-3">
              {waitingQueues.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-slate-500">No one waiting</p>
                </Card>
              ) : (
                waitingQueues.map((queue) => <QueueCard key={queue._id} queue={queue} />)
              )}
            </div>
          </div>

          {/* In Progress */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Play className="h-5 w-5" />
              In Progress ({inProgressQueues.length})
            </h2>

            <div className="space-y-3">
              {inProgressQueues.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-slate-500">No active services</p>
                </Card>
              ) : (
                inProgressQueues.map((queue) => <QueueCard key={queue._id} queue={queue} />)
              )}
            </div>
          </div>
        </div>

        {/* History */}
        {(completedQueues.length > 0 || cancelledQueues.length > 0) && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">History</h2>
            <div className="space-y-3">
              {[...completedQueues, ...cancelledQueues]
                .sort((a, b) => {
                  const dateA = a.completedAt ? new Date(a.completedAt).getTime() : new Date(a.joinedAt).getTime();
                  const dateB = b.completedAt ? new Date(b.completedAt).getTime() : new Date(b.joinedAt).getTime();
                  return dateB - dateA;
                })
                .slice(0, 10)
                .map((queue) => (
                  <QueueCard key={queue._id} queue={queue} />
                ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function OrgQueues() {
  return (
    <ProtectedRoute role="org">
      <OrgQueuesPage />
    </ProtectedRoute>
  );
}
