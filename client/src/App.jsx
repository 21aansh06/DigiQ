// import React, { useContext, useEffect } from 'react'
// import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import LandingPage from './pages/Home';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import QueueDetails from './pages/QueueDetails';
import CreateOrganization from './pages/OrgSignup';
import OrganizationLogin from './pages/OrgLogin';
import OrgDashboard from './pages/OrgDashboard';
import OrgQueueDetails from './pages/OrgQueueDetails';
// import Dashboard from './pages/Dashboard'
// import { AppContent } from './context/AppContext'


function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/user/dashboard' element={<UserDashboard/>}/>
        <Route path='/queues/:serviceId' element={<QueueDetails/>}/>
        <Route path='/organization/register' element={<CreateOrganization/>}/> 
        <Route path='/organization/login' element={<OrganizationLogin/>}/> 
        <Route path='/organization/dashboard' element={<OrgDashboard/>}/>
        <Route path='/organization/queues/:serviceId' element={<OrgQueueDetails/>}/> 
        {/* <Route path='/login' element={<Login />} />
        <Route path='/dashboard/:userId' element={<Dashboard />} /> */}
      </Routes>
    </div>
  )
}

export default App
