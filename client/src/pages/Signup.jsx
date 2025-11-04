import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function SignupPage() {
  const {backendURL}  = useContext(AppContent)
  const [role, setRole] = useState('serviceUser')
  const [email , setEmail] = useState("")
  const [name , setName] = useState("")
  const [phone , setPhone] = useState("")
  const [password , setPassword] = useState("")
  const navigate = useNavigate()
  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendURL + "/api/auth/user/register" ,{email ,name , password , phone} )
      if(data.success){
        navigate("/login")
        toast.success(data.message)
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <main className="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo + Brand */}
        <div className="mb-6 flex items-center justify-center gap-3 text-gray-900">
          <div className="mb-6 flex items-center justify-center gap-3 text-gray-900">
          <img src="/digiQ.jpg" alt="" className='w-15'/>
        </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">Create your account</h2>
          <p className="text-gray-600 text-sm mt-1">Sign up to start managing queues</p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={submitHandler}>
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">Name</label>
              <input
                type="text"
                className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500"
                placeholder="Jane Doe"
                required
                 onChange={e => setName(e.target.value)} value={name} 
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">Role</label>
              <select
                className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value.toLowerCase())}
                required
              >
                <option value="serviceUser">User</option>
                <option value="organization">Organization</option>
              </select>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500"
                placeholder="you@example.com"
                required
                 onChange={e => setEmail(e.target.value)} value={email} 
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">Phone</label>
              <input
                type="tel"
                inputMode="tel"
                className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500"
                placeholder="‪+91 98765 43210‬"
                required
                onChange={e => setPhone(e.target.value)} value={phone} 
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">Password</label>
              <div className="relative">
                <input
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 pr-10 outline-none focus:border-blue-500"
                  placeholder="Create a password"
                  required
                  onChange={e => setPassword(e.target.value)} value={password} 
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 h-11 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-semibold">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
