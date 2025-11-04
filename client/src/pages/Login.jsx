import React, { useContext, useState } from 'react'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const {backendURL , setIsLoggedIn , setUserData , userData} = useContext(AppContent)
  const navigate = useNavigate()
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendURL + "/api/auth/user/login" ,{email , password} )
      if(data.success){
        setUserData(data.user)
        navigate("/user/dashboard")
        setIsLoggedIn(true)
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
          <h2 className="text-2xl font-black text-gray-900">Welcome back</h2>
          <p className="text-gray-600 text-sm mt-1">Log in to your DigiQ account</p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={submitHandler}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500"
                placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)} value={email}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">Password</label>
              <div className="relative">
                <input
                type="password"
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 pr-10 outline-none focus:border-blue-500"
                  placeholder="••••••••"
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
              Log In
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-semibold">
              Get started
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
