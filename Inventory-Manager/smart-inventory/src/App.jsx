import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import AddInventory from './AddInventory'
import DashBoard from './DashBoard'
import ExpiringSoon from './ExpiringSoon'
import LoginForm from './LoginForm'
import PrivateRoute from './PrivateRoute'
import { useAuth } from './AuthContext'
import React, { useState } from 'react'
export default function App() {
  const{accessToken}=useAuth()
  const[menuOpen,setMenuOpen]=useState(false)
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
        {accessToken && (
          <>
            {/* Mobile Top Header & Hamburger Button */}
            <div className="md:hidden flex items-center justify-between bg-slate-900 px-5 py-4 border-b border-slate-800">
              <span className="font-extrabold text-lg text-white tracking-tight">Smart Inventory</span>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-bold border border-slate-700"
              >
                {menuOpen ? '✕ Close' : '☰ Menu'}
              </button>
            </div>

            {/* Mobile Backdrop Overlay */}
            {menuOpen && (
              <div
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
              />
            )}

            {/* 20% Left Sidebar (Pop-up Drawer on Mobile, Fixed Sidebar on Desktop) */}
            <div
              className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-3 transition-transform duration-200 ease-in-out ${
                menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
              }`}
            >
              <div className="mb-6 pb-4 border-b border-slate-800">
                <h1 className="text-xl font-black text-white tracking-tight">Smart Inventory</h1>
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mt-1">Manager Portal</p>
              </div>

              <Link
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                to="/dashboard"
              >
                📊 DashBoard
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                to="/addstock"
              >
                ➕ Add New Stock
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                to="/expiringsoon"
              >
                🚨 Expiring Soon
              </Link>

              <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-500 font-medium">
                • Real-time Cron Active
              </div>
            </div>
          </>
        )}

        {/* 80% Right Main Content Area */}
        <div className="flex-1 min-h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/addstock" element={<PrivateRoute><AddInventory /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
            <Route path="/expiringsoon" element={<PrivateRoute><ExpiringSoon /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}