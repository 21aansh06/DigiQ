import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Layers,
  CheckCircle2,
  Activity,
  LogOut,
  Building2,
  Clock,
  MapPin,
  Plus,
  Users,
} from "lucide-react";

const OrganizationDashboard = () => {
  const { backendURL, organization, setOrganization } = useContext(AppContent);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [averageTimePerCustomer, setAverageTimePerCustomer] = useState(10);
  const navigate = useNavigate();

  // Fetch organization profile on mount
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

  // Fetch services for this org
  const fetchServices = async (orgId) => {
    if (!orgId) {
      console.log("No organization ID provided");
      return;
    }
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${backendURL}/api/service/org/${orgId}`
      );
      if (data.success) {
        setServices(data.services || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      // Don't show error toast for empty services, just set empty array
      if (error.response?.status === 404) {
        setServices([]);
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  useEffect(() => {
    if (organization?._id) {
      fetchServices(organization._id);
    }
  }, [organization?._id]);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendURL}/api/auth/org/logout`);
      if (data.success) {
        setOrganization(null);
        toast.success(data.message);
        navigate("/organization/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendURL}/api/service/`, {
        name: serviceName,
        description: serviceDescription,
        averageTimePerCustomer: parseInt(averageTimePerCustomer) || 10
      });
      if (data.success) {
        toast.success("Service added successfully!");
        fetchServices(); // Refresh services list
        setServiceName("");
        setServiceDescription("");
        setAverageTimePerCustomer(10);
        setIsModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center max-w-7xl mx-auto px-6 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Organization Dashboard <span className="text-blue-600">Overview</span>
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Greeting & Add Service */}
        <section className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome, <span className="text-blue-600">{organization.name}</span> 👋
            </h2>
            <p className="text-gray-600 mt-2 text-base">
              Manage your services and monitor queues efficiently.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add New Service
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 p-6 rounded-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium">Total Services</p>
              <Layers className="text-blue-600" size={20} />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">{services.length}</h3>
          </div>

          <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 p-6 rounded-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium">Active Services</p>
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {services.filter((s) => s.isActive).length}
            </h3>
          </div>

          <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 p-6 rounded-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium">Recently Added</p>
              <Activity className="text-purple-600" size={20} />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {services.slice(-3).length}
            </h3>
          </div>
        </section>

        {/* Services List */}
        <section>
          {services && services.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-500 relative">
                    <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-white/90 text-blue-700 font-semibold shadow-sm">
                      {service.isActive ? "Active" : "Inactive"}
                    </div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <h4 className="text-lg font-semibold">{service.name}</h4>
                      <p className="text-xs opacity-90 line-clamp-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div className="space-y-3 text-sm text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-blue-600" />
                        <span className="font-medium">{organization.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={16} />
                        <span>{service.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-blue-600" />
                        <span>~{service.averageTimePerCustomer || 10} mins / customer</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/organization/queues/${service._id}`)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Users size={16} />
                      Manage Queue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No services registered yet.</p>
          )}
        </section>
      </div>

      {/* Overlay Modal for Adding Service */}
     {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Service</h2>
      <form className="space-y-4" onSubmit={handleAddService}>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Description</label>
          <textarea
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            rows={4}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition resize-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Average Time Per Customer (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={averageTimePerCustomer}
            onChange={(e) => setAverageTimePerCustomer(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition"
            placeholder="e.g., 10"
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps calculate estimated wait time for customers
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Add Service
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </main>
  );
};

export default OrganizationDashboard;
