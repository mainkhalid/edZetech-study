import React from 'react'
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { Player } from '@lottiefiles/react-lottie-player'
import { Home as HomeIcon } from 'lucide-react'

import { AuthProvider, useAuth } from './context/AuthContext'

import error404Animation from './assets/lotties/error404.json'

import Home from './layouts/Home'
import FAQ from './pages/FAQ'
import Research from './pages/Research'
import Admissions from './pages/Admissions'
import AcademicsPage from './pages/AcademicsPage'
import StudentLife from './pages/StudentLife'
import Study from './pages/Study'
import AboutZetech from './pages/AboutZetech'
import AdminDashboard from './layouts/AdminDashboard'
import Programmes from './pages/admin/Programmes'
import Dashboard from './pages/admin/Dashboard'
import History from './pages/admin/History'
import Faqadmin from './pages/admin/Faqadmin'
import Scholarships from './pages/admin/Scholarships'
import AdmissionsAdmin from './pages/admin/AdmissionsAdmin'
import Login from './pages/admin/Login'


function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  return children
}


function NotFound() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <Player
          autoplay
          loop
          src={error404Animation}
          style={{ height: '300px', width: '300px' }}
        />
        <h1 className="text-3xl font-black text-[#1a2b4c] mt-4">PAGE NOT FOUND</h1>
        <p className="text-slate-500 mt-2 mb-8">
          The link might be broken or the page has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-[#1a2b4c] text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-all"
        >
          <HomeIcon size={18} /> Take Me Home
        </button>
      </div>
    </div>
  )
}


function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />}>
          <Route index element={<Study />} />
          <Route path="about" element={<AboutZetech />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="research" element={<Research />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="student-life" element={<StudentLife />} />
        </Route>

        
        <Route path="/admin/login" element={<Login />} />

        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="programmes" replace />} />
          <Route path="programmes" element={<Programmes />} />
          <Route path="faqadmin" element={<Faqadmin />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scholars" element={<Scholarships />} />
          <Route path="history" element={<History />} />
          <Route path="admissions" element={<AdmissionsAdmin />} />
        </Route>

        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </>
  )
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}