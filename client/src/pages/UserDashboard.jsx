import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Building2,
  Clock,
  MapPin,
  Layers,
  CheckCircle2,
  Activity,
  LogOut,
} from "lucide-react";
import axios from "axios";

const UserDashboard = () => {
  const {
    setIsLoggedIn,
    services,
    getAllServices,
    backendURL,
    userData,
    organization,
    setOrganization,
  } = useContext(AppContent);
  const navigate = useNavigate();
  const [showOtpModal, setShowOtpModal] = useState(false);
const [phone, setPhone] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [selectedQueueId, setSelectedQueueId] = useState(null);
  if (!userData) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700 text-xl font-semibold">
      Loading Dashboard...
    </main>
  );
}


  useEffect(() => {
    getAllServices();
    if (userData.role === "organization") {
      fetchOrganization();
    }
  }, []);

  const fetchOrganization = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendURL + "/api/org/me");
      if (data.success) {
        setOrganization(data.organization);
      }
    } catch (error) {
      console.log(error);
    }
  };

const handleJoinQueue = async (id) => {
  setSelectedQueueId(id);
  setShowOtpModal(true);
};
const sendOtp = async () => {
  if (!phone) return toast.error("Please enter your phone number");
  try {
    const { data } = await axios.post(`${backendURL}/api/otp/request`, { phone });
    if (data.success) {
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

const verifyOtp = async () => {
  if (!otp) return toast.error("Please enter the OTP");
  try {
    const { data } = await axios.post(`${backendURL}/api/otp/verify`, { phone, otp });
    if (data.success) {
      toast.success("OTP Verified ✅");
      setShowOtpModal(false);
      setOtp("");
      setPhone("");
      setOtpSent(false);
      await joinQueueAfterOtp(selectedQueueId);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

const joinQueueAfterOtp = async (id) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/queues/${id}/join`);
    if (data.success) {
      navigate(`/queues/${id}`);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


  const logoutUser = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + "/api/auth/user/logout");
      if (data.success) {
        setIsLoggedIn(false);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const userName = userData.name;
  const userInitial = userName.charAt(0).toUpperCase();

  const totalServices = services?.length || 0;
  const activeServices = services?.filter((s) => s.isActive).length || 0;

  const showSetupOrgButton =
    userData.role === "organization" && !organization;

  const showOrgDashboardButton =
    userData.role === "organization" && organization;
  



  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center max-w-7xl mx-auto px-6 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard <span className="text-blue-600">Overview</span>
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold shadow">
            {userInitial}
          </div>
          <button
            onClick={logoutUser}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Greeting */}
        <section className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome back, <span className="text-blue-600">{userName} 👋</span>
            </h2>
            <p className="text-gray-600 mt-2 text-base">
              Explore and manage your service queues with a single click.
            </p>
          </div>

          {/* Organization Role Buttons */}
          {showSetupOrgButton && (
            <button
              onClick={() => navigate("/organization/register")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Setup Your Organization
            </button>
          )}

          {showOrgDashboardButton && (
            <button
              onClick={() => navigate("/organization/dashboard")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Manage Organization
            </button>
          )}
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 p-6 rounded-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium">Total Services</p>
              <Layers className="text-blue-600" size={20} />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {totalServices}
            </h3>
          </div>

          <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 p-6 rounded-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium">Active Services</p>
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {activeServices}
            </h3>
          </div>

          <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 p-6 rounded-2xl transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium">Recently Added</p>
              <Activity className="text-purple-600" size={20} />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {services?.slice(-3).length || 0}
            </h3>
          </div>
        </section>

        {/* Services Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900">
              Available Services
            </h3>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
              View All
            </button>
          </div>

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
                      <p className="text-xs opacity-90 line-clamp-1">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-blue-600" />
                        <span className="font-medium">
                          {service.organization?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={16} />
                        <span>{service.organization?.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-blue-600" />
                        <span>
                          ~{service.averageTimePerCustomer} mins / customer
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => handleJoinQueue(service._id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2.5 rounded-xl shadow hover:from-blue-700 hover:to-blue-600 transition-all"
                      >
                        Join Queue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">
              No services available right now.
            </p>
          )}
        </section>
      </div>
      {showOtpModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative animate-fadeIn">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        onClick={() => setShowOtpModal(false)}
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Join Queue Verification
      </h2>

      {!otpSent ? (
        <>
          <label className="block text-gray-700 font-medium mb-2">
            Enter your phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 9876543210"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
          />
          <button
            onClick={sendOtp}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <label className="block text-gray-700 font-medium mb-2">
            Enter the OTP sent to your phone
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-4"
          />
          <button
            onClick={verifyOtp}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Verify & Join Queue
          </button>
        </>
      )}
    </div>
  </div>
)}

    </main>
  );
};

export default UserDashboard;
