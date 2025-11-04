import React, { useState, useContext } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CreateOrganization = () => {
  const { backendURL, setOrganization } = useContext(AppContent);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("hospital");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendURL}/api/auth/org/register`, {
        name,
        email,
        password,
        address,
        type,
        phone,
      });
      if (data.success) {
        toast.success(data.message);
        setOrganization(data.organization);
        navigate("/organization/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6 flex items-center justify-center gap-3 text-gray-900">
          <img src="/digiQ.jpg" alt="" className='w-15'/>
        </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Setup Your <span className="text-blue-600">Organization</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Register your organization to start managing your services.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Apollo Hospital"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@org.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter strong password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="e.g. MG Road, Bangalore"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Organization Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value.toLowerCase())}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="Hospital">Hospital</option>
              <option value="Bank">Bank</option>
              <option value="Office">Office</option>
              <option value="Clinic">Clinic</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+91 9876543210"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            onClick={() => navigate("/organization/login")}
          >
            Create Organization
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an organization?{" "}
          <span
            onClick={() => navigate("/organization/login")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default CreateOrganization;
