import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import AddInventory from './AddInventory'
import DashBoard from './DashBoard'
import ExpiringSoon from './ExpiringSoon'
import LoginForm from './LoginForm'
import AddCustomer from './AddCustomer'
import CustomerList from './CustomerList'
import PrivateRoute from './PrivateRoute'
import { useAuth } from './AuthContext'
import React, { useState } from 'react'

function AppContent() {
  const { pathname } = useLocation()
  const { accessToken } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050b1a] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#00b4ff] selection:text-slate-950">
      {accessToken && pathname !== "/login" && (
        <>
          {/* Mobile Top Header */}
          <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-[#071128]/95 backdrop-blur-md px-4 py-3 border-b border-blue-900/60 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20 border border-white/20">
                SI
              </div>
              <div>
                <span className="font-extrabold text-xs text-white tracking-tight block leading-none">
                  Smart <span className="text-[#00b4ff]">Inventory</span>
                </span>
                <span className="text-[9px] text-slate-400 font-mono">CLOUD OS // v2.4</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-3 py-1.5 bg-blue-950/90 hover:bg-blue-900 text-cyan-300 rounded-lg border border-blue-700/60 transition-colors cursor-pointer font-mono text-xs uppercase font-bold"
            >
              {menuOpen ? 'Close [X]' : 'Menu [=]'}
            </button>
          </div>

          {/* Mobile Backdrop Overlay */}
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-[#020612]/80 backdrop-blur-sm z-40 md:hidden"
            />
          )}

          {/* Left Sidebar (Silicon Valley Deep Navy Console) */}
          <aside
            className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-50 w-64 h-screen bg-[#071128] border-r border-blue-900/60 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 shadow-2xl ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
              }`}
          >
            <div>
              {/* Brand Header (Matches Login Page Logo) */}
              <div className="px-5 py-6 border-b border-blue-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 border border-white/20">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">
                    Smart <span className="text-[#00b4ff]">Inventory</span>
                  </h1>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">OS // v2.4</p>
                </div>
              </div>

              {/* Navigation Section */}
              <div className="px-3 py-6">
                <p className="px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-3 font-semibold">Workspace</p>
                <nav className="flex flex-col gap-1.5">
                  {/* 1. DASHBOARD */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/dashboard"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${pathname === "/dashboard"
                        ? "bg-linear-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-600/25 border border-cyan-400/30"
                        : "text-slate-400 hover:bg-blue-950/60 hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                      </svg>
                      Dashboard
                    </span>
                    {pathname === "/dashboard" && <span className="text-xs font-black">→</span>}
                  </Link>

                  {/* 2. ADD STOCK */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/addstock"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${pathname === "/addstock"
                        ? "bg-linear-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-600/25 border border-cyan-400/30"
                        : "text-slate-400 hover:bg-blue-950/60 hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Stock
                    </span>
                    {pathname === "/addstock" && <span className="text-xs font-black">→</span>}
                  </Link>

                  {/* 3. EXPIRING SOON (Red/Rose Alert Theme) */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/expiringsoon"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${pathname === "/expiringsoon"
                        ? "bg-linear-to-r from-rose-600 to-orange-500 text-white font-bold shadow-lg shadow-rose-600/30 border border-rose-400/30"
                        : "text-slate-400 hover:bg-rose-950/40 hover:text-rose-400"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expiring Soon
                    </span>
                    {pathname === "/expiringsoon" && <span className="text-xs font-black">!</span>}
                  </Link>

                  {/* 4. UDHAR ENTRY (Fixed Pathname + User Add Icon) */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/addCustomer"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${pathname === "/addCustomer" || pathname === "/editCustomer"
                        ? "bg-linear-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-600/25 border border-cyan-400/30"
                        : "text-slate-400 hover:bg-blue-950/60 hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Udhar Entry
                    </span>
                    {(pathname === "/addCustomer" || pathname === "/editCustomer") && <span className="text-xs font-black">→</span>}
                  </Link>

                  {/* 5. UDHAR LIST (Fixed Pathname + Ledger Icon) */}
                  <Link
                    onClick={() => setMenuOpen(false)}
                    to="/customerList"
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${pathname === "/customerList"
                        ? "bg-linear-to-r from-rose-600 to-orange-500 text-white font-bold shadow-lg shadow-rose-600/30 border border-rose-400/30"
                        : "text-slate-400 hover:bg-rose-950/40 hover:text-rose-400"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Udhar List
                    </span>
                    {pathname === "/customerList" && <span className="text-xs font-black">→</span>}
                  </Link>
                </nav>
              </div>
            </div>

            {/* System Telemetry Footer */}
            <div className="p-3.5 m-3 rounded-xl bg-[#050b1a] border border-blue-900/70 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">Cron Engine</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </aside>
        </>
      )}

      {/* Right Main Content Canvas */}
      <main className="flex-1 min-h-screen overflow-x-hidden bg-[#050b1a]">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/addstock" element={<PrivateRoute><AddInventory /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
          <Route path="/expiringsoon" element={<PrivateRoute><ExpiringSoon /></PrivateRoute>} />
          <Route path="/addCustomer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
          <Route path="/editCustomer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
          <Route path="/customerList" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}