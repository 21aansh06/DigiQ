import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { ArrowLeft, Users, UserCheck, Clock } from "lucide-react";

const QueueDetails = () => {
  const { serviceId } = useParams();
  const { backendURL } = useContext(AppContent);
  const navigate = useNavigate();

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [service, setService] = useState(null);

  useEffect(() => {
    // getCurrentUser();
    fetchQueues();
  }, [serviceId]);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendURL}/api/queues/service/${serviceId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const sorted = res.data.queues.sort((a, b) => a.tokenNumber - b.tokenNumber);
        setQueues(sorted);
        if (res.data.service) {
          setService(res.data.service);
        }
      }
    } catch (error) {
      toast.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  const myEntry = currentUser
    ? queues.find((q) => q.user?._id === currentUser._id)
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold shadow-sm">
            {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{currentUser?.name || "User"}</p>
            <p className="text-gray-500 text-xs">Active Queue View</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-blue-600" size={22} />
            Service Queue
          </h2>
          <button
            onClick={fetchQueues}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition shadow"
          >
            Refresh
          </button>
        </div>

        {/* User Token */}
        {myEntry && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-gray-700 font-semibold text-sm mb-1">
                Your Token Number
              </h3>
              <p className="text-4xl font-bold text-blue-700">#{myEntry.tokenNumber}</p>
              <p className="text-gray-500 text-sm mt-1">
                Position:{" "}
                {queues.findIndex((q) => q._id === myEntry._id) + 1} of {queues.length}
              </p>
              {myEntry.estimatedWaitTime && (
                <div className="mt-3 flex items-center gap-2 text-blue-600">
                  <Clock size={16} />
                  <span className="font-semibold">
                    Estimated Wait Time: ~{myEntry.estimatedWaitTime} minutes
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                <UserCheck size={16} /> You're in queue
              </div>
              {myEntry.status === "waiting" && (
                <div className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                  {myEntry.status}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center bg-gray-50 px-5 py-3 border-b border-gray-100">
            <div className="text-gray-600 text-sm font-semibold">All Tokens</div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock size={15} />
              <span>{queues.length} total</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <p className="text-center py-8 text-gray-400">Loading queues...</p>
            ) : queues.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No one in queue yet.</p>
            ) : (
              queues.map((q, i) => {
                const isYou = currentUser && q.user?._id === currentUser._id;
                return (
                  <div
                    key={q._id}
                    className={`flex items-center justify-between px-5 py-4 transition ${
                      isYou ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-semibold text-lg ${
                          isYou
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {q.tokenNumber}
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-medium">
                          {q.user?.name || "Anonymous"}
                          {isYou && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {q.user?.phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          q.status === "waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          Showing tokens from 1 → {queues.length}
        </div>
      </div>
    </main>
  );
};

export default QueueDetails;
