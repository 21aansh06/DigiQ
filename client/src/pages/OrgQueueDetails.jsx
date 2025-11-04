import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { ArrowLeft, Users, CheckCircle2, Clock, UserCheck, XCircle } from "lucide-react";

const OrgQueueDetails = () => {
  const { serviceId } = useParams();
  const { backendURL, organization, setOrganization } = useContext(AppContent);
  const navigate = useNavigate();

  const [queues, setQueues] = useState([]);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch organization profile on mount if not set
  const fetchOrganization = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendURL}/api/auth/org/me`);
      if (data.success) {
        setOrganization(data.organization);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      navigate("/organization/login");
    }
  };

  useEffect(() => {
    if (!organization?._id) {
      fetchOrganization();
    }
  }, []);

  useEffect(() => {
    if (organization?._id) {
      fetchService();
      fetchQueues();
    }
  }, [serviceId, organization?._id]);

  useEffect(() => {
    // Set up auto-refresh every 5 seconds
    if (serviceId) {
      const interval = setInterval(() => {
        fetchQueues();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      if (!organization?._id) return;
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendURL}/api/service/org/${organization._id}`);
      if (data.success) {
        const foundService = data.services.find((s) => s._id === serviceId);
        setService(foundService);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendURL}/api/queues/service/${serviceId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const sorted = res.data.queues.sort((a, b) => a.tokenNumber - b.tokenNumber);
        setQueues(sorted);
      }
    } catch (error) {
      toast.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (queueId, newStatus) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(
        `${backendURL}/api/queues/${queueId}`,
        { status: newStatus }
      );
      if (data.success) {
        toast.success(`Queue marked as ${newStatus.replace("_", " ")}`);
        fetchQueues(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update queue status");
    }
  };

  const waitingQueues = queues.filter((q) => q.status === "waiting");
  const inProgressQueues = queues.filter((q) => q.status === "in_progress");
  const completedQueues = queues.filter((q) => q.status === "completed");

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={() => navigate("/organization/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold shadow-sm">
            {organization?.name?.charAt(0)?.toUpperCase() || "O"}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{organization?.name || "Organization"}</p>
            <p className="text-gray-500 text-xs">Queue Management</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Service Info */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Users size={24} />
            {service?.name || "Service"} Queue
          </h2>
          <p className="text-blue-100">{service?.description || "Manage your service queue"}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Total: {queues.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck size={16} />
              <span>Waiting: {waitingQueues.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>In Progress: {inProgressQueues.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle size={16} />
              <span>Completed: {completedQueues.length}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Waiting</p>
                <p className="text-3xl font-bold text-yellow-600">{waitingQueues.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{inProgressQueues.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCheck className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedQueues.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Waiting Queue Section */}
        {waitingQueues.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="text-yellow-600" size={20} />
              Waiting Queue ({waitingQueues.length})
            </h3>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
              <div className="divide-y divide-gray-100">
                {waitingQueues.map((q) => (
                  <div
                    key={q._id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl font-bold text-xl bg-yellow-100 text-yellow-700">
                        #{q.tokenNumber}
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">
                          {q.user?.name || "Anonymous"}
                        </h4>
                        <p className="text-gray-500 text-sm">{q.user?.phone || "N/A"}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Joined: {new Date(q.joinedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStatusUpdate(q._id, "in_progress")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                      >
                        <UserCheck size={16} />
                        Mark as Attended
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* In Progress Queue Section */}
        {inProgressQueues.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="text-blue-600" size={20} />
              Currently Serving ({inProgressQueues.length})
            </h3>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
              <div className="divide-y divide-gray-100">
                {inProgressQueues.map((q) => (
                  <div
                    key={q._id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl font-bold text-xl bg-blue-600 text-white">
                        #{q.tokenNumber}
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">
                          {q.user?.name || "Anonymous"}
                        </h4>
                        <p className="text-gray-500 text-sm">{q.user?.phone || "N/A"}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Started: {new Date(q.joinedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStatusUpdate(q._id, "completed")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        Mark as Served
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Completed Queue Section (Collapsible) */}
        {completedQueues.length > 0 && (
          <section>
            <details className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  Completed ({completedQueues.length})
                </h3>
                <span className="text-gray-500 text-sm">Click to expand</span>
              </summary>
              <div className="divide-y divide-gray-100">
                {completedQueues.map((q) => (
                  <div
                    key={q._id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-green-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl font-bold text-xl bg-green-100 text-green-700">
                        #{q.tokenNumber}
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">
                          {q.user?.name || "Anonymous"}
                        </h4>
                        <p className="text-gray-500 text-sm">{q.user?.phone || "N/A"}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Completed:{" "}
                          {q.completedAt
                            ? new Date(q.completedAt).toLocaleTimeString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </section>
        )}

        {/* Empty State */}
        {!loading && queues.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No one in queue yet</h3>
            <p className="text-gray-500">Waiting for customers to join the queue</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading queue...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrgQueueDetails;

